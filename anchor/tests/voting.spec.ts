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
     try {
       const account = await program.account.candidate.fetch(canditatePda)
      assert.equal(account.name , "danish","name not matched!")
      assert.equal(account.candidateVotes.toNumber(),0)
      console.log("candidate account",account)
      const pollAccount = await program.account.poll.fetch(pollPda)
      assert.equal(pollAccount.canditatesAmounts.toNumber(),1,"candidate amount is not 0")
     } catch (error) {
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
    assert.equal(account.candidateVotes.toNumber(),0)
    console.log("candidate account",account)
    const pollAccount = await program.account.poll.fetch(pollPda)
    assert.equal(pollAccount.canditatesAmounts.toNumber(),1,"candidate amount is not 0")
     }
  })
  it("vote initialize",async()=>{
    const pollId = new BN(0)
    const [votePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        pollId.toArrayLike(Buffer,"le",8),
       provider.wallet.publicKey.toBuffer()
      ],
      program.programId
    ) 
    const [pollPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        pollId.toArrayLike(Buffer,"le",8),
      ],
      program.programId
    ) 
    const [candidatePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        pollId.toArrayLike(Buffer,"le",8),
        Buffer.from("danish")
      ],
      program.programId
    ) 
     try {
      const account = await program.account.vote.fetch(votePda)
      assert.equal(account.candidateName.toString(),"danish")
     } catch (error) {
       await program.methods.vote(
        "danish",
        pollId
      )
      .accounts({
        poll:pollPda,
        candidate:candidatePda,
        vote:votePda,
        signer:anchor.getProvider().wallet?.publicKey,
        systemProgram:anchor.web3.SystemProgram.programId
      } as any)
      .rpc()
      
      const account = await program.account.vote.fetch(votePda)
      console.log("account of vote",account)
      console.log("account.candidateName",account.candidateName)
      assert.equal(account.candidateName.toString(),"danish")
     }
  })
});