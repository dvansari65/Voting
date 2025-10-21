'use client'
import ActivePolls from '@/components/vote/ActivePolls'
import CreatePoll from '@/components/vote/CreatePoll'
import NumberOfVotes from '@/components/vote/NumberOfVotes'
import TotalVoters from '@/components/vote/TotalVoters'
import { useWallet } from '@solana/wallet-adapter-react'
import { useState } from 'react'
import { initializePoll } from '../hooks/blockChain'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid';
type activeTabType = 'create-poll' | 'browse-vote'

export default function Home() {
  const [description,setDescription] = useState<string>("")
  const [startDate,setStartDate] = useState<number>(0)
  const [endDate,setEndDate] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<activeTabType>('create-poll')
  const {mutate,isPending,error} = initializePoll()
  const uuid = uuidv4()
  const {connected} = useWallet()
  const queryClient = useQueryClient()
  const handleCreatePoll = async()=>{
    if(!startDate){
      toast.error("Please provide start date!")
      return;
    }
    if(!endDate){
      toast.error("Please provide end date!")
      return;
    }
    if(!connected){
      toast.error("Please connect your wallet first!")
      return;
    }
    const convertedStartDate = Math.floor(startDate / 1000)
    const convertedEndDate = Math.floor(endDate / 1000)
    console.log("start date in milli seconds",startDate)
    console.log("timestamps",convertedEndDate)
    const payload = {
      pollId:Number(uuid),
      description,
      startDate:convertedStartDate,
      endDate:convertedEndDate
    }
    console.log("payload",payload)
    mutate(payload,{
      onSuccess:(data)=>{
        console.log("data from poll account",data)
        queryClient.invalidateQueries({queryKey:["polls"]})
        toast.success("Poll created successfully!")
        setDescription("")
        setStartDate(0)
        setEndDate(0)
      },
      onError:(error)=>{
        toast.error(error.message)
        return;
      }
    })
  }
  
  if(error) return toast.error("Something went wrong!")

  return (
    <div className="w-full h-screen multi-layer-bg overflow-y-scroll flex flex-col p-4   ">
      <div className=" h-[40vh] p-2 flex justify-center items-center gap-10 ">
        <ActivePolls />
        <TotalVoters />
        <NumberOfVotes />
      </div>
      <div className="flex flex-col p-2 ">
        <div className="flex justify-center items-center ">
          <div className="border border-gray-400 rounded-2xl ">
            <button
              onClick={() => setActiveTab('create-poll')}
              className={`rounded-t-2xl rounded-r-[0px] text-2xl hover:bg-gray-700 px-20 py-2  ${
                activeTab === "create-poll" ? 
                'bg-gray-700 border-b-[5px] border-blue-500' : 'bg-slate-900 border-b-[5px] border-gray-500 '
                 }`}
            >
              Create Poll
            </button>
            <button
              onClick={() => setActiveTab('browse-vote')}
              className={`rounded-t-2xl rounded-l-[0px] text-2xl px-20 py-2 hover:bg-gray-700 bg-slate-900 ${
                 activeTab === "browse-vote" ? 
                'bg-gray-700 border-b-[5px] border-blue-500' : 'bg-slate-900 border-b-[5px] border-gray-500 '
                }`}
            >
              Browse Vote
            </button>
            {
              activeTab == "create-poll" && 
              <CreatePoll
                isCreating={isPending}
                isConnected={connected}
                description={description}
                setDescription={setDescription}
                startDate={Number(startDate)}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                handleCreatePoll={handleCreatePoll}
              />
            }
          </div>
        </div>
        <div></div>
      </div>
    </div>
  )
}
