import { candidateInfo } from '@/types/candidate'
import { X } from 'lucide-react'
import React from 'react'

interface CandidatesInfoProps {
  candidateName: candidateInfo[]
  isOpen: boolean
  onClose: () => void
  className?: string
}

function CandidatesInfo({ candidateName, isOpen, onClose, className }: CandidatesInfoProps) {
  if (!isOpen) return null
  return (
    <div
      className={`w-[500px] bg-purple-900  md:p-8 md:pt-2 md:pr-2 rounded-2xl border  border-white/20 mb-4 ${className}`}
    >
      <div className="w-full flex justify-end">
        <button onClick={onClose}>
          <X />
        </button>
      </div>
      {candidateName.map((candidateName) => (
        <div className=" mx-auto h-full flex flex-col justify-center">
          <span>{candidateName?.name || 'Danish Ansari'}</span>
        </div>
      ))}
    </div>
  )
}

export default CandidatesInfo
