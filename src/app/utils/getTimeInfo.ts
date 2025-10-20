import { pollPdaAccount } from '@/types/polls'

export const getTimeInfo = (poll: pollPdaAccount | null) => {
  const now = Math.floor(Date.now() / 1000)
  console.log('end date', Number(poll?.endDate))
  console.log('start date', Number(poll?.startDate))
  console.log('now time', now)
  if (poll && now < poll.startDate && !(now > poll.endDate)) {
    console.log('reached in this condition!')
    const diff = Number(poll.startDate) - now
    const days = Math.floor(diff / 86400)
    const hours = Math.floor((diff % 86400) / 3600)
    return { label: 'Starts in', value: `${days}d ${hours}h` }
  }
  if (poll && now <= poll.endDate && now > poll.startDate) {
    const diff = Number(poll.endDate) - now
    const days = Math.floor(diff / 86400)
    const hours = Math.floor((diff % 86400) / 3600)
    return { label: 'Ends in', value: `${days}d ${hours}h` }
  }
  if (poll && now >= poll.endDate) {
    console.log('reached in this condition!')
    return { label: 'Status', value: 'Completed' }
  }
  console.log('2reached in this condition!')
  return { label: 'Status', value: 'Completed' }
}
