import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { describe, it, before } from 'node:test'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { BanksClient, startAnchor } from "solana-bankrun"
import { Votee } from "../target/types/votee"
import assert from 'node:assert'

const voteeAddress = new PublicKey("8tjgdgACTGjLZFPu6fzFUfb1Sp5c9KWq4TLr7cAWMUKi")

describe('Voting', () => {
  let context: any;
  let program: Program<Votee>;
  let provider: anchor.AnchorProvider;

  before(async () => {
    context = await startAnchor(
      "",
      [{ name: "votee", programId: voteeAddress }],
      []
    );
    
    provider = new anchor.AnchorProvider(
      context.banksClient as unknown as Connection,
      context.payer,
      { commitment: 'confirmed' }
    );
    
    anchor.setProvider(provider);
    program = new Program<Votee>(
      JSON.parse(JSON.stringify(require('../target/idl/votee.json'))),
      provider
    );
  });

  it('initialize poll', async () => {
    const pollId = new anchor.BN(1);
    const description = "danish ansari is a computer science student!";
    
    const [pollPda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from(pollId.toArray('le', 8))],
      program.programId
    );

    const tx = await program.methods.initializePoll(
      pollId,
      description,
      new anchor.BN(0),
      new anchor.BN(1860604107)
    ).accounts({
      poll: pollPda,
      signer: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId
    } as any).rpc();

    const pollAccount = await program.account.poll.fetch(pollPda);
    
    assert.equal(pollAccount.pollId.toString(), pollId.toString());
    assert.equal(pollAccount.description, description);
    assert.equal(pollAccount.startDate.toNumber(), 0);
    assert.equal(pollAccount.endDate.toNumber(), 1860604107);
    assert.equal(pollAccount.bump, bump);
  });
});