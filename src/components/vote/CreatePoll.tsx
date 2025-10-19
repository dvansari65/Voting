import { Vote } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'

interface createPollProps {
  isConnected:boolean
}

function CreatePoll({isConnected}:createPollProps) {
  if(!isConnected){
    return (
      <div className='flex flex-col justify-center items-center p-4 bg-slate-900 gap-4'>
        <div>
          <Vote/>
        </div>
        <div>
          Connect Your Wallet
        </div>
        <div>
          Please connect your wallet to create a poll
        </div>
        <Button>Connect Wallet</Button>
      </div>
    )
  }
  
}

export default CreatePoll