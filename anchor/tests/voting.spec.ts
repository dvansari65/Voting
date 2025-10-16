import * as anchor from "@coral-xyz/anchor";
import { Program  } from "@coral-xyz/anchor";
import {Votee} from "../target/types/votee"
import BN from "bn.js"
import  "mocha"
import {assert} from "chai"
describe('Voting', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const newAccount = anchor.web3.Keypair.generate();
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
    assert(account.description ==  "danish is a computer science student!","description not matched!")
    
  })
});