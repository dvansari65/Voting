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
  
  // if (error) {
  //   return (
  //     <div className="max-w-4xl flex items-center justify-center bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
  //       <div className="bg-red-500/20 border border-red-500 rounded-lg p-8 max-w-md">
  //         <h2 className="text-red-400 text-xl font-bold mb-2">Error</h2>
  //         <p className="text-red-200">{error.message}</p>
  //       </div>
  //     </div>
  //   )
  // }
  
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