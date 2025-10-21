import React from 'react'
import { Input } from '../ui/input'
import { X } from 'lucide-react';

interface InitializeCandidateProps {
  className: string,
  onClose:()=>void,
  isOpen:boolean
}

function InitializeCandidate({ className,isOpen,onClose }: InitializeCandidateProps) {
    if(!isOpen) return null;
  return (
    <div className={`${className}`}>
        <div>
            <button><X/></button>
        </div>
      <div>
        <label htmlFor="" className="">
          Enter Name
        </label>
        <Input placeholder="e.g Danish" />
      </div>
    </div>
  )
}

export default InitializeCandidate
