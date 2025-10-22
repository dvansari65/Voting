'use client'
import { formatDateTime12Hour } from '@/app/utils/formatDateTime12Hrs'
import { getPollStatus } from '@/app/utils/getStatus'
import { getTimeInfo } from '@/app/utils/getTimeInfo'
import CandidatesInfo from '@/components/modals/candidatesInfo'
import InitializeCandidate from '@/components/modals/initializeCandidate'
import Loader from '@/components/ui/loader'
import { initializeCandidate } from '@/hooks/blockChain'
import { useSinglePoll } from '@/hooks/useSinglePoll'
import { useVoteProgram } from '@/hooks/useVoteProgram'
import { pollPdaAccount } from '@/types/polls'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useQueryClient } from '@tanstack/react-query'
import { Calendar, FileText, Hash, Users } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

function Page() {
  const params = useParams()
  const { program } = useVoteProgram()
  const [candidateName,setCandidateName] = useState("")
  const [initializeCandidateModal, setInitializeCandidateModal] = useState(false)
  const [candidatesInfoModal, setCandidatesInfoModal] = useState(false)
  const publickey = params?.publickey as string
  const {connected} = useWallet()
  const queryClient = useQueryClient()
  const { mutate, isPending, error: candidateError } = initializeCandidate()
  const convertedPublicKey = new PublicKey(publickey)
  const {data,isPending:isLoading,error:pollError} = useSinglePoll(convertedPublicKey)
  useEffect(()=>{
    console.log("single poll",data);
    
  },[data])
  const pollStatus = data ? getPollStatus(data) : null
  const timeInfo = data ? getTimeInfo(data) : null

  const handleOpenCandidateInfoModal = () => {
    console.log("poll?.canditatesAmounts",Number(data?.canditatesAmounts))
    if (Number(data?.canditatesAmounts) === 0) {
      toast.error('No Candidate Registered yet!')
      return
    }
    setCandidatesInfoModal(true)
  }
  const handleInitializeCandidate = ()=>{
    if(!candidateName){
      toast.error("Please provide candidate name!")
      return;
    }
    if(!data?.pollId){
      toast.error("Please provide poll ID!")
      return;
    }
   if(!connected){
    toast.error("Connect your wallet first!")
    return;
   }
    const payload ={
      candidateName,
      pollId:data?.pollId.toString(),
      program
    }
    mutate(payload,{
      onSuccess:(data)=>{
        setInitializeCandidateModal(false)
        queryClient.invalidateQueries({queryKey:["poll"]})
        console.log("data",data)
      }
    })
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
  return (
    <div className=" relative min-h-screen w-full multi-layer-bg p-4 md:p-8">
      <div className="max-w-4xl mx-auto h-full flex flex-col justify-center">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 mb-6 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Hash className="w-8 h-8 text-purple-400" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">Poll ID: {(data?.pollId)}</h1>
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
      {
        initializeCandidateModal && (
          <InitializeCandidate
          isLoading={isPending}
          candidateName={candidateName}
          setCandidateName={setCandidateName}
          initializeCandidate={handleInitializeCandidate}
          onClose={()=>setInitializeCandidateModal(false)}
          isOpen={initializeCandidateModal}
          className='absolute top-[25%] left-[34%]  '
          />
        )
      }
      {
        isPending && <div className='absolute top-[30%] left-[45%] '>
          <Loader />
        </div>
      }

    </div>
  )
}

export default Page
