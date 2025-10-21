import { PublicKey, SystemProgram } from '@solana/web3.js'
import { BN } from 'bn.js'
import idl from '../idl/votee.json'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { votePdaType } from '../types/vote'
import { toast } from 'sonner'
import { useVoteProgram } from '../hooks/useVoteProgram'

const PROGRAM_ID = new PublicKey(idl.address)

export const useGetPollPda = (pollId: number) => {
  const [pda] = PublicKey.findProgramAddressSync([Buffer.from(new BN(pollId).toArray('le', 8))], PROGRAM_ID)
  return pda
}
export const getPollAcount = async (program: any, publicKey: PublicKey) => {
  try {
    const pda = await (program.account as any).poll.fetch(publicKey)
    console.log('pda', pda)
    return pda
  } catch (error) {
    console.error('Failed to fetch poll account!', error)
    return null
  }
}

export const useGetCandidatePda = (candidateName: string, pollId: number) => {
  const [candidatePda] = PublicKey.findProgramAddressSync(
    [new BN(pollId).toArrayLike(Buffer, 'le', 8), Buffer.from(candidateName)],
    PROGRAM_ID,
  )
  return candidatePda
}

export const useGetVotePda = (pollId: number, candidateName: string) => {
  const [votePda] = PublicKey.findProgramAddressSync(
    [Buffer.from(new BN(pollId).toArray('le', 8)), Buffer.from(candidateName)],
    PROGRAM_ID,
  )
  return votePda
}

export const initializePoll = () => {
  const { program: voteProgram, provider } = useVoteProgram()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      pollId,
      description,
      startDate,
      endDate,
    }: {
      pollId: string
      description: string
      startDate: number
      endDate: number
    }) => {
      try {
        if (!voteProgram) {
          throw new Error('Program is not Initialized! Please connect your wallet!')
        }
        if (!provider.publicKey) {
          throw new Error('Wallet not connected!')
        }
        if (!voteProgram.provider.publicKey) {
          throw new Error('Wallet not connected!')
        }
        const pollPda = useGetPollPda(pollId)
        const result = await voteProgram.methods
          .initializePoll(new BN(pollId), description, new BN(startDate), new BN(endDate))
          .accounts({
            poll: pollPda,
            signer: voteProgram.provider.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc()
        console.log('result', result)
        return result
      } catch (error) {
        console.error('something went wrong!', error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['polls'] })
    },
  })
}

export const initializeCandidate = () => {
  const queryClient = useQueryClient()
  const { program } = useVoteProgram()
  return useMutation({
    mutationFn: async ({ candidateName, pollId }: { candidateName: string; pollId: number }) => {
      if (!program.provider.publicKey) {
        throw new Error('Connect your wallet first!')
      }
      const candidatePda = useGetCandidatePda(candidateName, pollId)
      const pollPda = useGetPollPda(pollId)

      const data = await program.methods
        .initializeCandidate(candidateName, new BN(pollId))
        .accounts({
          candidate: candidatePda,
          poll: pollPda,
          signer: program.provider.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc()
      console.log('data from the candidate:', data)
      return data
    },
    onSuccess: (data) => {
      console.log('data', data)
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['AllPolls'] })
        toast.success('Candidate initialized successfully!')
      }
    },
    onError: (error) => {
      console.error(error.message)
      throw error.message
    },
  })
}

export const initializeVote = () => {
  const { program } = useVoteProgram()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ candidateName, pollId }: { candidateName: string; pollId: number }) => {
      const votePda = useGetVotePda(pollId, candidateName)
      return program.methods
        .initializeVote(pollId, candidateName)
        .accounts({
          vote: votePda,
        })
        .rpc()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['votes'] })
    },
  })
}
