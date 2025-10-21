import React from 'react'
import { X } from 'lucide-react'

interface InitializeCandidateProps {
  className: string
  onClose: () => void
  isOpen: boolean
  initializeCandidate: () => void
  candidateName: string
  setCandidateName: (value: React.SetStateAction<string>) => void;
  isLoading:boolean
}

function InitializeCandidate({
  className,
  isLoading,
  isOpen,
  onClose,
  candidateName,
  setCandidateName,
  initializeCandidate
}: InitializeCandidateProps) {
  if (!isOpen) return null
  
  return (
    <div className={`${className} lg:w-full  max-w-md`}>
      <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 border-b border-slate-700 lg:w-full lg:flex lg:items-center lg:justify-between">
          <h2 className="text-xl font-bold text-white lg:w-full text-center">Register as Candidate</h2>
        </div>

        {/* Form Content */}
        <form className="p-6 space-y-6">
          {/* Candidate Name Input */}
          <div className="space-y-2">
            <label htmlFor="candidatename" className="text-sm font-medium text-slate-300 block">
              Candidate Name
            </label>
            <input
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="e.g. Danish"
              value={candidateName}
              id="candidatename"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
            disabled={isLoading}
              onClick={initializeCandidate}
              type="button"
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/50"
            >
              Register
            </button>
            <button
              onClick={onClose}
              type="button"
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 px-6 rounded-lg transition-all duration-200 border border-slate-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default InitializeCandidate