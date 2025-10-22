import React from 'react'
import { Calendar, Clock, Hash } from 'lucide-react'
import { PublicKey } from '@solana/web3.js'

interface pollCardProps {
  pollId: number | null
  description: string
  startDate: number
  endDate: number,
}

function PollCard({ pollId, description, startDate, endDate }: pollCardProps) {
  // Format date helper
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Check if poll is active
  const now = Math.floor(Date.now() / 1000)
  const isActive = now >= startDate && now <= endDate
  const isUpcoming = now < startDate
  const isEnded = now > endDate

  const getStatusBadge = () => {
    if (isActive) return (
      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold border border-green-500/30">
        • Active
      </span>
    )
    if (isUpcoming) return (
      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold border border-blue-500/30">
        Upcoming
      </span>
    )
    return (
      <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-semibold border border-gray-500/30">
        Ended
      </span>
    )
  }

  return (
    <div className="group relative bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl  hover:border-purple-500/50">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-500/30">
              <Hash className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Poll
              </h2>
              <p className="text-sm text-gray-400 flex items-center gap-1">
                ID: <span className="text-purple-400 font-mono">{pollId }</span>
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Description</p>
          <p className="text-green-400 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-semibold">Start Date</span>
            </div>
            <p className="text-white font-semibold pl-6">
              {formatDate(startDate)}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-semibold">End Date</span>
            </div>
            <p className="text-white font-semibold pl-6">
              {formatDate(endDate)}
            </p>
          </div>
        </div>

        {/* View Details Button */}
        <button className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/50">
          View Details
        </button>
      </div>

      {/* Decorative gradient blur */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10" />
    </div>
  )
}

export default PollCard