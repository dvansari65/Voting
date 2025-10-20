import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { formatDateTimeLocal } from '@/app/utils/FormatDate'

interface CreatePollCardProps {
  pollId: number | null
  setPollId: (value: number | null) => void
  description: string
  setDescription: (value: string) => void
  startDate:number
  setStartDate: (value: number) => void
  endDate: number
  setEndDate: (value: number) => void
  handleCreatePoll: () => void
  isCreating: boolean
}

function CreatePollCard({
  pollId,
  setPollId,
  description,
  setDescription,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handleCreatePoll,
  isCreating,
}: CreatePollCardProps) {
  const handleSubmit = (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    handleCreatePoll();
  }

  return (
    <form onSubmit={handleSubmit} className="p-5 flex flex-col  bg-slate-900 rounded-b-2xl">
      <div className='mb-1'>
        <label className="block text-white font-semibold mb-2">Poll ID</label>
        <Input
          type="number"
          value={pollId ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            setPollId(value === '' ? null : Number(value));
          }}
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
          placeholder="Enter unique poll ID (e.g., 1)"
        />
      </div>
      <div className='mb-2'>
        <label className="block text-white font-semibold mb-2">Poll Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value )}
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 h-24"
          placeholder="What would you like people to vote on?"
          maxLength={280}
        />
        <p className="text-purple-300 text-sm mt-1">{description?.length}/280 characters</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-1">
        <div>
          <label className="block text-white font-semibold mb-2">Start Date</label>
          <Input
            type="datetime-local"
            value={formatDateTimeLocal(startDate)}
            onChange={(e) => {
              if(e.target.value){
                setStartDate(new Date(e.target.value).getTime())
              }
            }}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
            min={formatDateTimeLocal(Date.now())}
          />
        </div>
        <div>
          <label className="block text-white font-semibold mb-2">End Date</label>
          <Input
            type="datetime-local"
            value={new Date(endDate || Date.now()).toISOString().slice(0,16)}
            onChange={(e) => setEndDate(new Date(e.target.value).getTime())}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
          />
        </div>
      </div>
      <Button
        type='submit'
        disabled={isCreating}
        className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-bold text-lg hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-3"
      >
        {isCreating ? 'Creating Poll...' : 'Create Poll'}
      </Button>
    </form>
  )
}

export default CreatePollCard
