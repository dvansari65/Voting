import React from 'react'
import { User, ChevronRight } from 'lucide-react'

interface candidatesProps {
  candidateName: string
  pollId: string
  onClick?: ({ pollId, candidateName }: { pollId: string; candidateName: string }) => void
}

function Candidates({ candidateName, onClick, pollId }: candidatesProps) {
  const handleClick = () => {
    onClick?.({ pollId, candidateName })
  }
  
  return (
    <button onClick={handleClick} className="w-full group">
      <div className="flex justify-between items-center px-4 bg-white/10 rounded-xl backdrop-blur-md p-3 md:p-4 mb-2 border border-white/20 hover:bg-white/20 hover:border-purple-400/50 transition-all duration-200 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-purple-500/30 p-2 rounded-lg border border-purple-400/30">
            <User className="w-5 h-5 text-purple-300" />
          </div>
          <span className="text-white font-medium text-lg">{candidateName}</span>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-200" />
      </div>
    </button>
  )
}

export default Candidates