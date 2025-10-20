
import { PublicKey } from '@solana/web3.js'
import { BN } from 'bn.js'
import idl from "../idl/votee.json"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { votePdaType } from '../types/vote'
import { toast } from 'sonner'
import { useVoteProgram } from "../hooks/useVoteProgram"

const PROGRAM_ID = new PublicKey(idl.address)


export const useGetPollPda = (pollId:number)=> {
    const [pda] = PublicKey.findProgramAddressSync(
        [Buffer.from(new BN(pollId).toArray("le",8))],
        PROGRAM_ID
    )
    return pda;
}
export const getPollAcount = async(program:any,publicKey:PublicKey)=>{
    try {
        const pda = await (program.account as any).poll.fetch(publicKey)
        console.log("pda",pda)
        return pda;
    } catch (error) {
        console.error("Failed to fetch poll account!",error)
        return null;
    }
}

export const useGetCandidatePda = (candidateName:string,pollId:number)=>{
    const [candidatePda] = PublicKey.findProgramAddressSync(
        [Buffer.from(new BN(pollId).toArray("le",8)),Buffer.from(candidateName)],
        PROGRAM_ID
    )
    return candidatePda;
}

export const useGetVotePda = (pollId:number,candidateName:string)=>{
    const [votePda] = PublicKey.findProgramAddressSync(
        [Buffer.from(new BN(pollId).toArray("le",8)),Buffer.from(candidateName)],
        PROGRAM_ID
    )
    return votePda
}

export const initializePoll = ()=>{
    const {program:voteProgram,provider} = useVoteProgram()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:async(
            {
                pollId,
                description,
                startDate,
                endDate
            }:votePdaType
        )=>{
            try {
                if(!voteProgram){
                    toast.error("Program is not Initialized! Please connect your wallet!")
                    return;
                }
                if(!provider.publicKey){
                    toast.error("Wallet not connected!")
                    return;
                }
                const pollPda = useGetPollPda(pollId)
                const result = await voteProgram.methods
                .initializePoll(
                    new BN(pollId),
                    description,
                    new BN(startDate),
                    new BN(endDate)
                )
                .accounts({
                    poll:pollPda
                })
                .rpc()
                console.log("result",result)
                return result;
            } catch (error) {
                console.error("something went wrong!",error)
                throw error;
            }
        },
        onSuccess:()=>{
            queryClient.invalidateQueries({ queryKey: ['polls'] });
        }
    })
}

export const initializeCandidate = ()=>{
    const {program} = useVoteProgram()
    const queryclient = useQueryClient()
    return useMutation({
        mutationFn: async ({candidateName,pollId}:{candidateName:string,pollId:number})=>{
            const candidatePda = useGetCandidatePda(candidateName,pollId)
            return program.methods
            .initializeCandidate(
                candidateName,pollId
            )
            .accounts({
                candidate:candidatePda
            })
            .rpc()
        },
        onSuccess:()=>{
            queryclient.invalidateQueries({queryKey:["candidates"]})
        }
    })
}


export const initializeVote = ()=>{
    const {program} = useVoteProgram()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({candidateName,pollId}:{candidateName:string,pollId:number})=>{
            const votePda = useGetVotePda(pollId,candidateName)
            return program.methods
            .initializeVote(
                pollId,
                candidateName
            )
            .accounts({
                vote:votePda
            })
            .rpc()
        },
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["votes"]})
        }
    })
}


