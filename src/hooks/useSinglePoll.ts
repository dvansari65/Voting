import { PublicKey } from "@solana/web3.js";
import { useVoteProgram } from "./useVoteProgram";
import { useQuery } from "@tanstack/react-query";
import { pollPdaAccount } from "@/types/polls";


export const useSinglePoll = (publicKey:PublicKey | undefined)=>{
    const {program} = useVoteProgram()
    return useQuery<pollPdaAccount>({
        queryKey:["poll",publicKey],
        queryFn:async()=>{
            try {
                if(!publicKey){
                    throw new Error("Please connect your wallet first!")
                }
                if(!program){
                    throw new Error("Provide program!")
                }
                const data = await (program.account as any).poll.fetch(publicKey)
                if(!data){
                    throw new Error("Data not found!")
                }
                return data;
            } catch (error:any) {
                console.error(error.message)
                throw error;
            }
        }
    })
}