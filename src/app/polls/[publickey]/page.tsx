'use client'
import { formatDateTime12Hour } from '@/app/utils/formatDateTime12Hrs'
import { getPollStatus } from '@/app/utils/getStatus'
import { getTimeInfo } from '@/app/utils/getTimeInfo'
import Candidates from '@/components/candidates'
import CandidatesInfo from '@/components/modals/candidatesInfo'
import InitializeCandidate from '@/components/modals/initializeCandidate'
import VoteModal from '@/components/modals/vote'
import Loader from '@/components/ui/loader'
import { initializeCandidate, PROGRAM_ID} from '@/hooks/blockChain'
import { useSinglePoll } from '@/hooks/useSinglePoll'
import { useVoteProgram } from '@/hooks/useVoteProgram'
import { candidateInfo } from '@/types/candidate'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import { useQueryClient } from '@tanstack/react-query'
import { Calendar, FileText, Hash, Users, Wallet } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

function Page() {
  const params = useParams()
  const { program } = useVoteProgram()
  const [candidateName, setCandidateName] = useState('')
  const [initializeCandidateModal, setInitializeCandidateModal] = useState(false)
  const [candidatesInfoModal, setCandidatesInfoModal] = useState(false)
  const [regAsCandidateError,setRegAsCandidateError] = useState("")
  const [voteModal, setVoteModal] = useState<boolean>(false)
  const [candidateData, setCandidateData] = useState<candidateInfo | undefined>(undefined)
  const [selectedCandidateName, setSelectedCandidateName] = useState<string>('')
  const publickey = params?.publickey as string
  const { connected, publicKey: walletPublicKey } = useWallet()
  const queryClient = useQueryClient()

  const { mutate, isPending, error: candidateError } = initializeCandidate()
  const convertedPublicKey = new PublicKey(publickey)
  const { data, isPending: isLoading, error: pollError } = useSinglePoll(convertedPublicKey)

  const pollStatus = data ? getPollStatus(data) : null
  const timeInfo = data ? getTimeInfo(data) : null

  const handleOpenCandidateInfoModal = () => {
    console.log('poll?.canditatesAmounts', Number(data?.canditatesAmounts))
    if (Number(data?.canditatesAmounts) === 0) {
      toast.error('No Candidate Registered yet!')
      return
    }
    setCandidatesInfoModal(true)
  }
  const handleInitializeCandidate = () => {
    if (!candidateName) {
      toast.error('Please provide candidate name!')
      return
    }
    if (!data?.pollId) {
      toast.error('Please provide poll ID!')
      return
    }
    if (!connected) {
      toast.error('Connect your wallet first!')
      return
    }
    const [candidatePda] = PublicKey.findProgramAddressSync(
      [Buffer.from('poll_v2'), Buffer.from(pollId), Buffer.from(candidateName)],
      program.programId,
    )
    const [pollPda] = PublicKey.findProgramAddressSync([Buffer.from('poll_v2'), Buffer.from(pollId)], PROGRAM_ID)
    const payload = {
      candidateName,
      pollId: data?.pollId.toString(),
      program,
      pollPda,
      candidatePda
    }
    mutate(payload, {
      onSuccess: (data) => {
        setInitializeCandidateModal(false)
        queryClient.invalidateQueries({ queryKey: ['poll'] })
        console.log('data', data)
      },
      onError:(error)=>{
      toast.error(error.message)
      return;
      }
    })
  }

  const handleGetCandidateAccount = async ({ pollId, candidateName }: { pollId: string; candidateName: string }) => {
    try {
      const [candidatePda] = PublicKey.findProgramAddressSync(
        [Buffer.from('poll_v2', 'utf-8'), Buffer.from(pollId), Buffer.from(candidateName)],
        program.programId,
      )
      const info = await program.provider.connection.getAccountInfo(candidatePda)
      if (!candidatePda) {
        toast.error('Candidate pda not obtained!')
        return
      }
      const candidateAccountData = await (program.account as any).candidate.fetch(candidatePda)
      if (!candidateAccountData) {
        console.warn('Discriminator mismatch — this account is not Candidate type')
        return null
      }
      setCandidateData(candidateAccountData)
      setSelectedCandidateName(candidateName)
      setVoteModal(true)
    } catch (error: any) {
      toast.error(error.message)
      throw error
    }
  }

  const handleVote = async () => {
    if (!connected || !walletPublicKey) {
      toast.error('Connect your wallet first!')
      return
    }
    if (!data?.pollId || !selectedCandidateName) {
      toast.error('Invalid poll or candidate!')
      return
    }

    try {
      const pollId = data.pollId.toString()
      // Derive PDAs
      const [votePda] = PublicKey.findProgramAddressSync(
        [Buffer.from('vote_me'), Buffer.from(pollId), Buffer.from(selectedCandidateName),walletPublicKey.toBuffer()],
        PROGRAM_ID,
      )
      const [candidatePda] = PublicKey.findProgramAddressSync(
        [Buffer.from('poll_v2'), Buffer.from(pollId), Buffer.from(selectedCandidateName)],
        PROGRAM_ID,
      )

      const [pollPda] = PublicKey.findProgramAddressSync([Buffer.from('poll_v2'), Buffer.from(pollId)], PROGRAM_ID)
      // Check if user already voted for this candidate
      const existingVote = await program.provider.connection.getAccountInfo(votePda)
      if (existingVote) {
        toast.error('You have already voted for this candidate!')
        return
      }
      if(walletPublicKey.toString().trim() !== program?.provider?.publicKey?.toString().trim()){
        toast.error("Keys mismatched occured!")
        return;
      }
      // Call the vote instruction
      const tx = await program.methods
        .vote(selectedCandidateName, pollId)
        .accounts({
          vote: votePda,
          poll: pollPda,
          candidate: candidatePda,
          signer: walletPublicKey,
          systemProgram:SystemProgram.programId
        })
        .rpc()
      console.log('Vote transaction:', tx)
      toast.success('Vote submitted successfully!')
      // Refresh candidate data
      await handleGetCandidateAccount({ pollId, candidateName: selectedCandidateName })
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['AllPolls'] })
    } catch (error: any) {
      console.error('Vote error:', error)
      toast.error(error.message || 'Failed to submit vote')
    }
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader />
      </div>
    )
  }
  if (pollError) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-8 max-w-md">
          <h2 className="text-red-400 text-xl font-bold mb-2">Error</h2>
          <p className="text-red-200">{pollError.message}</p>
        </div>
      </div>
    )
  }
  if (candidateError) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-8 max-w-md">
          <h2 className="text-red-400 text-xl font-bold mb-2">Error</h2>
          <p className="text-red-200">{candidateError.message}</p>
        </div>
      </div>
    )
  }
  if (!data) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p className="text-white">No poll data available</p>
      </div>
    )
  }
  const pollId = String(data?.pollId)
  return (
    <div className=" relative min-h-screen w-full multi-layer-bg p-4 md:p-8">
      <div className="max-w-4xl mx-auto h-full flex flex-col justify-center">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 mb-6 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Hash className="w-8 h-8 text-purple-400" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">Poll ID: {data?.pollId}</h1>
            </div>
            {pollStatus && (
              <span className={`${pollStatus?.color} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
                {pollStatus?.text.toString()}
              </span>
            )}
          </div>

          {/* Time Info */}
          {timeInfo && (
            <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-400/30">
              <p className="text-purple-200 text-sm mb-1">{timeInfo?.label.toString()}</p>
              <p className="text-white text-2xl font-bold">{timeInfo?.value}</p>
            </div>
          )}
        </div>

        <div className="border border-gray-500 py-2">
          <span className="px-1 py-2 font-bold ">Candidates:</span>
          {data?.candidateNames?.map((name, index) => (
            <div key={`${name}-${index}`}>
              <Candidates candidateName={name} pollId={pollId} onClick={handleGetCandidateAccount} />
            </div>
          ))}
        </div>
        {/* Main Content */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl flex-1">
          {/* Description */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Description</h2>
            </div>
            <p className="text-gray-200 text-lg leading-relaxed bg-black/20 rounded-lg p-4">
              {data?.description.toString()}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Candidates */}
            <button
              onClick={handleOpenCandidateInfoModal}
              className=" bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-6 border border-blue-400/30"
            >
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6 text-blue-400" />
                <p className="text-blue-200 text-sm font-medium">Candidates</p>
              </div>
              <p className="text-white text-3xl font-bold text-start">{Number(data?.canditatesAmounts)}</p>
            </button>

            {/* Start Date */}
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-6 border border-green-400/30">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-6 h-6 text-green-400" />
                <p className="text-green-200 text-sm font-medium">Start Date</p>
              </div>
              <p className="text-white text-sm font-semibold">{formatDateTime12Hour(Number(data?.startDate))}</p>
            </div>

            {/* End Date */}
            <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl p-6 border border-orange-400/30">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-6 h-6 text-orange-400" />
                <p className="text-orange-200 text-sm font-medium">End Date</p>
              </div>
              <p className="text-white text-sm font-semibold">{formatDateTime12Hour(Number(data?.endDate))}</p>
            </div>
          </div>
          <div className="w-full flex justify-center items-center mt-5">
            <button onClick={() => setInitializeCandidateModal(true)} className="px-3 bg-purple-400 rounded-xl py-3">
              Register for the Candidate
            </button>
          </div>
        </div>
      </div>
      {candidatesInfoModal && (
        <CandidatesInfo
          className="absolute left-[25%] top-[40%]"
          onClose={() => setCandidatesInfoModal(false)}
          isOpen={candidatesInfoModal}
          candidateNames={data?.candidateNames}
        />
      )}
      {initializeCandidateModal && (
        <InitializeCandidate
          isLoading={isPending}
          candidateName={candidateName}
          setCandidateName={setCandidateName}
          initializeCandidate={handleInitializeCandidate}
          onClose={() => setInitializeCandidateModal(false)}
          isOpen={initializeCandidateModal}
          className="fixed top-[25%] left-[34%]  "
        />
      )}
      {isPending && (
        <div className="absolute top-[30%] left-[45%] ">
          <Loader />
        </div>
      )}
      {voteModal && candidateData && (
        <VoteModal
          candidateName={candidateData.name}
          totalVotes={Number(candidateData?.candidateVotes)}
          onClose={() => {
            setVoteModal(false)
            setCandidateData(undefined)
            setSelectedCandidateName('')
          }}
          onVote={handleVote}
          isOpen={voteModal}
          className="fixed"
        />
      )}
    </div>
  )
}

export default Page
