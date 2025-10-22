import { X } from 'lucide-react'
import React from 'react'

interface errorProps {
  className?: string
  errorMessage: string | undefined
  onClose: () => void
  isOpen: boolean
}

function Error({ className, errorMessage, onClose, isOpen }: errorProps) {
  if (!isOpen) return null
  return (
    <div className={` p-3 rounded-xl bg-red-900 ${className} `}>
      <button  className='w-full flex justify-end p-1' onClick={onClose}>
        <X />
      </button>
      <div className='text-center text-red-400'>{errorMessage}</div>
    </div>
  )
}

export default Error
