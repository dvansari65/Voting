import React from 'react'
import { X, Vote as VoteIcon, User } from 'lucide-react'

interface VoteModalProps {
  isOpen: boolean
  onClose: () => void
  candidateName: string
  totalVotes: number
  onVote: () => void
  className?: string
}

function VoteModal({ isOpen, onClose, candidateName, totalVotes, onVote, className }: VoteModalProps) {
  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}>
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-purple-500/30 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <User className="w-7 h-7 text-purple-400" />
            Candidate Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Candidate Info */}
        <div className="bg-white/10 rounded-xl p-6 mb-6 border border-white/20">
          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-1">Candidate Name</p>
            <p className="text-white text-2xl font-bold">{candidateName}</p>
          </div>
          
          <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-400/30">
            <p className="text-purple-200 text-sm mb-1">Total Votes Received</p>
            <p className="text-white text-4xl font-bold">{totalVotes}</p>
          </div>
        </div>

        {/* Vote Button */}
        <button
          onClick={onVote}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-purple-500/50"
        >
          <VoteIcon className="w-5 h-5" />
          Cast Your Vote
        </button>

        <p className="text-gray-400 text-sm text-center mt-4">
          You can only vote once per candidate
        </p>
      </div>
    </div>
  )
}

export default VoteModal