import { useVoteProgram } from '@/hooks/useVoteProgram'
import { useQuery } from '@tanstack/react-query'

export const getAllPolls = () => {
  const { program } = useVoteProgram()
  return useQuery({
    queryKey: ['AllPolls'],
    queryFn: async () => {
      try {
        const connection = program.provider.connection
        const allAccounts = await connection.getProgramAccounts(program.programId)
        console.log(`Total accounts found: ${allAccounts.length}`)
        const polls = await (program.account as any).poll.all()
        console.log('polls', polls)
        return polls
      } catch (error: any) {
        console.error('Failed to fetch polls!', error.message)
      }
    },
  })
}
