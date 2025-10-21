'use client'
import { formatDateTime12Hour } from '@/app/utils/formatDateTime12Hrs'
import { getPollStatus } from '@/app/utils/getStatus'
import { getTimeInfo } from '@/app/utils/getTimeInfo'
import CandidatesInfo from '@/components/candidate/candidatesInfo'
import Loader from '@/components/ui/loader'
import { initializeCandidate } from '@/hooks/blockChain'
import { useVoteProgram } from '@/hooks/useVoteProgram'
import { pollPdaAccount } from '@/types/polls'
import { PublicKey } from '@solana/web3.js'
import { Calendar, FileText, Hash, Users } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

function Page() {
  const params = useParams()
  const { program } = useVoteProgram()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [poll, setPoll] = useState<pollPdaAccount | null>(null)
  const [candidateModal, setCandidateModal] = useState(false)
  const [candidatesInfoModal, setCandidatesInfoModal] = useState(false)
  const publickey = params?.publickey as string

  const pollStatus = poll ? getPollStatus(poll) : null
  const timeInfo = poll ? getTimeInfo(poll) : null
  const { mutate, isPending, error: candidateError } = initializeCandidate()
  useEffect(() => {
    const getSinglePoll = async () => {
      setLoading(true)
      console.log('public key', publickey)
      if (!publickey) {
        setLoading(false)
        setError('Please provide publicKey')
        return
      }
      if (!program) {
        setLoading(false)
        setError('Program is not provided!')
        return
      }
      try {
        const convertedPublicKey = new PublicKey(publickey)
        const data = await (program?.account as any).poll.fetch(convertedPublicKey)
        console.log('poll data', data)
        if (!data) {
          setError('Data not found!')
          return
        }
        setPoll(data)
      } catch (error: any) {
        console.error('Failed to get poll!', error)
        setLoading(false)
        setError(error.message || 'Failed to get poll!')
        return null
      } finally {
        setLoading(false)
      }
    }
    getSinglePoll()
  }, [publickey])

  useEffect(() => {
    console.log('poll', poll)
  }, [poll])

  const handleCandidateInfoModal = () => {
    // if(poll?.canditatesAmounts === 0 || poll?.candidateNames.length === 0){
    //   toast.error("No Candidates Registered yet!");
    //   return;
    // }
    setCandidatesInfoModal(true)
  }

  // const handleInitializeCandidate = ()=>[
  //   mutate({

  //   })
  // ]

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader />
      </div>
    )
  }
  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-8 max-w-md">
          <h2 className="text-red-400 text-xl font-bold mb-2">Error</h2>
          <p className="text-red-200">{error}</p>
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
  if (!poll) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p className="text-white">No poll data available</p>
      </div>
    )
  }
  return (
    <div className=" relative min-h-screen w-full multi-layer-bg p-4 md:p-8">
      <div className="max-w-4xl mx-auto h-full flex flex-col justify-center">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 mb-6 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Hash className="w-8 h-8 text-purple-400" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">Poll #{Number(poll?.pollId)}</h1>
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

        {/* Main Content */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl flex-1">
          {/* Description */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Description</h2>
            </div>
            <p className="text-gray-200 text-lg leading-relaxed bg-black/20 rounded-lg p-4">
              {poll?.description.toString()}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Candidates */}
            <button
              onClick={() => setCandidatesInfoModal(true)}
              className=" bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-6 border border-blue-400/30"
            >
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6 text-blue-400" />
                <p className="text-blue-200 text-sm font-medium">Candidates</p>
              </div>
              <p className="text-white text-3xl font-bold text-start">{Number(poll?.canditatesAmounts)}</p>
            </button>

            {/* Start Date */}
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-6 border border-green-400/30">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-6 h-6 text-green-400" />
                <p className="text-green-200 text-sm font-medium">Start Date</p>
              </div>
              <p className="text-white text-sm font-semibold">{formatDateTime12Hour(Number(poll?.startDate))}</p>
            </div>

            {/* End Date */}
            <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl p-6 border border-orange-400/30">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-6 h-6 text-orange-400" />
                <p className="text-orange-200 text-sm font-medium">End Date</p>
              </div>
              <p className="text-white text-sm font-semibold">{formatDateTime12Hour(Number(poll?.endDate))}</p>
            </div>
          </div>
          <div className="w-full flex justify-center items-center mt-5">
            <button onClick={() => setCandidateModal(true)} className="px-3 bg-purple-400 rounded-xl py-3">
              Register for the Candidate
            </button>
          </div>
        </div>
      </div>
      {
        candidatesInfoModal && <CandidatesInfo className='absolute' onClose={()=>setCandidatesInfoModal(false)} isOpen={candidatesInfoModal} candidateName={poll?.candidateNames}/>
      }
      
    </div>
  )
}

export default Page
