import { Vote } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import CreatePollCard from './CreatePollCard'
import { WalletButton } from '../solana/solana-providers'

interface createPollProps {
  isConnected:boolean,
  description:string,
  setDescription:(value:string)=>void,
  startDate:number,
  setStartDate:(value:number | number)=>void,
  endDate:number,
  setEndDate:(value:number | number)=>void
  handleCreatePoll:()=>void,
  isCreating:boolean
}

function CreatePoll({
  isConnected,
  description,
  setDescription,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handleCreatePoll,
  isCreating
}:createPollProps) {
  if(!isConnected){
    return (
      <div className='flex flex-col justify-center items-center p-5 bg-transparent gap-4 rounded-b-2xl text-black'>
        <div className=''>
          <Vote size={50}className='text-green-500'/>
        </div>
        <div className='text-2xl'>
          Connect Your Wallet
        </div>
        <div>
          Please connect your wallet to create a poll
        </div>
       <div>
        <WalletButton>Connect Wallet</WalletButton>
       </div>
      </div>
    )
  }
  if(isConnected){
    return (
      <CreatePollCard
      startDate={startDate}
      description={description}
      setDescription={setDescription}
      setStartDate={setStartDate}
      endDate={endDate}
      setEndDate={setEndDate}
      handleCreatePoll={handleCreatePoll}
      isCreating={isCreating}
      />
    )
  }

}

export default CreatePoll