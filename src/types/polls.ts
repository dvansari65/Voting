import { candidateInfo } from "./candidate";


export interface Poll {
    pollId:number | null;
    description:string,
    startDate:number,
    endDate:number
}

export interface pollPdaAccount {
    canditatesAmounts:number ,
    startDate:number,
    endDate:number
    description:string,
    pollId:number,
    candidateNames:string[]
}

export interface getAllPollsResponse {
    account:pollPdaAccount,
    publicKey:string
}