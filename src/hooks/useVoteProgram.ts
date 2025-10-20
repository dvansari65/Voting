"use client"
import { AnchorProvider, Program } from "@coral-xyz/anchor"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import idl from "../../anchor/target/idl/votee.json"
import {Votee} from "../../anchor/target/types/votee"
export const useVoteProgram = ()=>{
    const {connection} = useConnection()
    const wallet = useWallet()
    const provider = new AnchorProvider(connection,wallet as any,{
        commitment:"confirmed"
    })
    const program = new Program(idl as Votee,provider)
    return {provider,program}
}