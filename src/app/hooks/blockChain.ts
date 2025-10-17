import { PublicKey } from '@solana/web3.js'
import { BN } from 'bn.js'
import { AnchorProvider, Program } from "@coral-xyz/anchor"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import idl from "../../../anchor/target/idl/votee.json"
import {Votee} from "../../../anchor/target/types/votee"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { votePdaType } from '../types/vote'

const PROGRAM_ID = new PublicKey(idl.address)
export const useVoteProgram = ()=>{
    const {connection} = useConnection()
    const wallet = useWallet()
    const provider = new AnchorProvider(connection,wallet as any,{
        commitment:"confirmed"
    })
    const program = new Program(idl as Votee,provider)
    return {provider,program}
}

export const useGetPollPda = (pollId:number)=> {
    const [pda] = PublicKey.findProgramAddressSync(
        [Buffer.from(new BN(pollId).toArray("le",8))],
        PROGRAM_ID
    )
    return pda;
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
    const {program} = useVoteProgram()
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
                const pollPda = useGetPollPda(pollId)
                return program.methods
                .initializePoll(pollId,description,startDate,endDate)
                .accounts({
                    poll:pollPda
                })
                .rpc()
            } catch (error) {
                console.error("something went wrong!",error)
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
            return program.methods.initializeVote(
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

