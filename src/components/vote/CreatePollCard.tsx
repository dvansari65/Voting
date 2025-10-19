import React, { useState } from 'react'

interface CreatePollCardProps {
  pollId: number,
  setPollId:(value:number)=>void,
  description:string,
  setDescription:(value:string)=>void,
  startDate:number,
  setStartDate:(value:number)=>void,
  endDate:number,
  setEndDate:(value:number)=>void
  handleCreatePoll:()=>void,
  isCreating:boolean
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
    isCreating
}:CreatePollCardProps) {
  return (
    <div>
      <div>
        <label className="block text-white font-semibold mb-2">Poll ID</label>
        <input
          type="number"
          value={pollId}
          onChange={(e) => setPollId(Number(e.target.value))}
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
          placeholder="Enter unique poll ID (e.g., 1)"
        />
      </div>

      <div>
        <label className="block text-white font-semibold mb-2">Poll Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 h-24"
          placeholder="What would you like people to vote on?"
          maxLength={280}
        />
        <p className="text-purple-300 text-sm mt-1">{description.length}/280 characters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-white font-semibold mb-2">Start Date</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(Number(e.target.value))}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
          />
        </div>
        <div>
          <label className="block text-white font-semibold mb-2">End Date</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(Number(e.target.value))}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
          />
        </div>
      </div>
      <button
        onClick={handleCreatePoll}
        disabled={isCreating}
        className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-bold text-lg hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isCreating ? 'Creating Poll...' : 'Create Poll'}
      </button>
    </div>
  )
}

export default CreatePollCard
