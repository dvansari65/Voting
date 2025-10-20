

import { useVoteProgram } from "@/hooks/useVoteProgram"
import { useQuery } from "@tanstack/react-query"

export const getAllPolls = ()=>{
    const {program,provider} = useVoteProgram()
    return useQuery({
        queryKey:["AllPolls"],
        queryFn:async()=>{
            try {
               const polls =  await (program.account as any).poll.all()
               console.log("polls",polls)
               
                return polls;
            } catch (error:any) {
                console.error("Failed to fetch polls!",error.message)
            }
        }
    })
}