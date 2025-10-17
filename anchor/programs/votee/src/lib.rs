use anchor_lang::prelude::*;

declare_id!("8tjgdgACTGjLZFPu6fzFUfb1Sp5c9KWq4TLr7cAWMUKi");

#[program]
pub mod votee {
    use super::*;

    pub fn initialize_poll(
        ctx: Context<InitializePoll>,
        _poll_id: u64,
        description: String,
        start_date: u64,
        end_date: u64,
    ) -> Result<()> {
        let poll = &mut ctx.accounts.poll;
        poll.poll_id = _poll_id;
        poll.description = description;
        poll.start_date = start_date;
        poll.end_date = end_date;
        poll.canditates_amounts = 0;
        poll.bump = ctx.bumps.poll;
        Ok(())
    }
    pub fn initialze_canditate(
        ctx: Context<InitializeCanditate>,
        canditate_name: String,
        _poll_id: u64,
    ) -> Result<()> {
        let candidate = &mut ctx.accounts.candidate;
        candidate.name = canditate_name;
        let poll = &mut ctx.accounts.poll;
        poll.canditates_amounts += 1;
        candidate.candidate_votes = 0;
        Ok(())
    }
    pub fn vote(
        ctx: Context<InitializeVote>,
        _canditate_name: String,
        _poll_id: u64,
    ) -> Result<()> {
        let candidate = &mut ctx.accounts.candidate;
        let poll = &mut ctx.accounts.poll;
        let vote = &mut ctx.accounts.vote;
        let cloned_candidate_name = _canditate_name.clone();
        candidate.name = cloned_candidate_name;
        poll.poll_id = _poll_id;
        vote.voter = ctx.accounts.signer.key();
        vote.candidate_name =  _canditate_name;
        poll.canditates_amounts += 1;
        candidate.candidate_votes += 1;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(poll_id: u64)]
pub struct InitializePoll<'info> {
    #[account( init , payer = signer , space = 8 + Poll::INIT_SPACE  , seeds = [ poll_id.to_le_bytes().as_ref()],bump  )]
    pub poll: Account<'info, Poll>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(canditate_name:String,poll_id:u64)]
pub struct InitializeCanditate<'info> {
    #[account(
        mut,
        seeds= [poll_id.to_le_bytes().as_ref()],
        bump = poll.bump
    )]
    pub poll: Account<'info, Poll>,
    #[account(init,payer = signer , space = 8 + Candidate::INIT_SPACE , seeds = [poll_id.to_le_bytes().as_ref(),canditate_name.as_bytes()] , bump, )]
    pub candidate: Account<'info, Candidate>,
    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(candidate_name:String,poll_id:u64)]
pub struct InitializeVote<'info> {
    #[account(init, space = 8 + Vote :: INIT_SPACE ,payer = signer, seeds = [poll_id.to_le_bytes().as_ref(),candidate_name.as_bytes()],bump)]
    pub vote: Account<'info, Vote>,
    #[account(
        seeds = [poll_id.to_le_bytes().as_ref()],
        bump = poll.bump
    )]
    pub poll: Account<'info, Poll>,
    #[account(
        mut,
        seeds = [poll_id.to_le_bytes().as_ref(),candidate_name.as_bytes()],
        bump
    )]
    pub candidate: Account<'info, Candidate>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Poll {
    pub poll_id: u64,
    pub bump: u8,
    #[max_len(280)]
    pub description: String,
    pub start_date: u64,
    pub end_date: u64,
    pub canditates_amounts: u64,
}

#[account]
#[derive(InitSpace)]
pub struct Candidate {
    #[max_len(32)]
    pub name: String,
    pub candidate_votes: u64,
}

#[account]
#[derive(InitSpace)]
pub struct Vote {
    #[max_len(32)]
    pub candidate_name: String,
    pub poll_id: u64,
    pub voter:Pubkey
}
