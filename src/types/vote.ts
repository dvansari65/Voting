import { PublicKey } from "@solana/web3.js"

export interface votePdaType {
    pollId:number,
    description:string,
    startDate:number,
    endDate:number
}

export interface votePda {
    candidateName:string | undefined,
    pollId:string | undefined,
    voter:PublicKey | undefined
}

export interface votePdaResponse {
    account:votePda
}