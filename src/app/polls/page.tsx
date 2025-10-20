"use client"
import { getAllPolls } from '@/api/getAllPolls'
import PollCard from '@/components/Polls/PollCard'
import { getAllPollsResponse, Poll } from '@/types/polls'
import React, { useEffect } from 'react'

function Polls() {
  const {data: Polls, isPending, error} = getAllPolls()
  
  useEffect(() => {
    console.log("polls", Polls)
  }, [Polls])
  
  return (
    <div className='w-full h-screen overflow-y-scroll multi-layer-bg p-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {
          Polls?.map(({account, publicKey}: getAllPollsResponse) => (
            <div key={publicKey.toString()} className='h-full'>
              <PollCard
                pollId={Number(account?.pollId)}
                description={account.description}
                startDate={Number(account.startDate)}
                endDate={Number(account.endDate)}
              />
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Polls