"use client"
import { getAllPolls } from '@/api/getAllPolls'
import EmptyState from '@/components/EmptyState'
import PollCard from '@/components/Polls/PollCard'
import Loader from '@/components/ui/loader'
import { getAllPollsResponse } from '@/types/polls'
import Link from 'next/link'
import React from 'react'

function Polls() {
  const {data: Polls, isPending, error} = getAllPolls()
  
  return (
    <div className=' w-full h-screen overflow-y-scroll multi-layer-bg p-4'>
      <div className='relative flex flex-col  gap-10 px-5'>
        {
          Polls?.map(({account, publicKey}: getAllPollsResponse) => (
            <Link href={`/polls/${publicKey.toString()}`}   key={publicKey.toString()} className='h-full'>
              <PollCard
                pollId={(account?.pollId)}
                description={account.description}
                startDate={Number(account.startDate)}
                endDate={Number(account.endDate)}
              />
            </Link>
          ))
        }
        {
          (Polls?.length === 0 || Polls == undefined || error) && <EmptyState />
        }
      </div>
      {
        isPending && <div className='absolute flex items-center justify-center w-full h-screen '>
          <Loader/>
        </div>
      }
    </div>
  )
}

export default Polls