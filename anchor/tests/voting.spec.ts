import * as anchor from "@coral-xyz/anchor";
import { Program  } from "@coral-xyz/anchor";
import {Votee} from "../target/types/votee"
import BN from "bn.js"
import  "mocha"
import {assert} from "chai"
describe('Voting', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Votee as Program<Votee>
  it("is initialized",async()=>{
    const pollId = new BN(0)
    const [pollPda] =  anchor.web3.PublicKey.findProgramAddressSync(
      [pollId.toArrayLike(Buffer,"le",8)],
      program.programId
    )
    const tx = await program.methods.initializePoll(
      pollId,
      "danish is a computer science student!",
      new BN(0),
      new BN(1760618394)
    )
    .accounts(
      {
        poll:pollPda,
        signer:anchor.getProvider().wallet?.publicKey,
        systemProgram : anchor.web3.SystemProgram.programId
      } as any
    )
    .rpc()
    const account = await program.account.poll.fetch(pollPda)
    console.log("account",account)
    console.log("tx",tx)
    
    assert(account.description ==  "danish is a computer science student!","description not matched!")
    
  })
  it("is intialized canditate",async()=>{
    const candidateName = "danish"
    const pollId = new BN(0)
    const [pollPda] =  anchor.web3.PublicKey.findProgramAddressSync(
      [pollId.toArrayLike(Buffer,"le",8)],
      program.programId
    )
    const [canditatePda] =  anchor.web3.PublicKey.findProgramAddressSync(
      [
        pollId.toArrayLike(Buffer,"le",8),
        Buffer.from(candidateName)
      ],
      program.programId
    ) 
     await program.methods.initialzeCanditate(
        candidateName,
        pollId
    )
    .accounts({
      poll:pollPda,
      candidate:canditatePda,
      signer:anchor.getProvider().wallet?.publicKey,
      systemProgram:anchor.web3.SystemProgram.programId
    } as any)
    .rpc()
  
    const account = await program.account.candidate.fetch(canditatePda)
    assert.equal(account.name , "danish","name not matched!")

    const pollAccount = await program.account.poll.fetch(pollPda)
    assert.equal(pollAccount.canditatesAmounts.toNumber(),1,"candidate amount is not 0")
  })
});