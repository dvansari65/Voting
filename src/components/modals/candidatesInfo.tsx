"use client"
import { candidateInfo } from '@/types/candidate'
import { X } from 'lucide-react'
import React, { useEffect } from 'react'
import {v4} from "uuid"
interface CandidatesInfoProps {
  candidateNames: string[]
  isOpen: boolean
  onClose: () => void
  className?: string
}

function CandidatesInfo({ candidateNames, isOpen, onClose, className }: CandidatesInfoProps) {
  if (!isOpen) return null
 useEffect(()=>{
  console.log("candidates name",candidateNames[0]);
 },[candidateNames])
 
  return (
    <div
      className={`w-[500px] bg-purple-900  md:p-8 md:pt-2 md:pr-2 rounded-2xl border  border-white/20 mb-4 ${className}`}
    >
      <div className="w-full flex justify-end">
        <button onClick={onClose}>
          <X/>
        </button>
      </div>
      <div className='w-full flex justify-center'>
      <span className='text-2xl font-bold mb-1'>
          Candidates
        </span>
      </div>
      
      {candidateNames?.map((candidateName,index) => (
        <div key={`${candidateName}-${index}`} className=" mx-auto h-full flex flex-col justify-start">
          <span className='border border-gray-500 rounded-[5px] m-1 p-1 pl-2 font-bold'># {candidateName }</span>
        </div>
      ))}
    </div>
  )
}

export default CandidatesInfo
