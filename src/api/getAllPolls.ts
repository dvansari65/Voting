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
        const polls = await (program.account as any).poll.all()
        return polls
      } catch (error: any) {
        console.error('Failed to fetch polls!', error.message)
      }
    },
  })
}
