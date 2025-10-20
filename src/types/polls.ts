

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
    pollId:number
}

export interface getAllPollsResponse {
    account:pollPdaAccount,
    publicKey:string
}