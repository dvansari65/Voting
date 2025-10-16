use anchor_lang::prelude::*;

declare_id!("8tjgdgACTGjLZFPu6fzFUfb1Sp5c9KWq4TLr7cAWMUKi");

#[program]
pub mod votee {
    use super::*;

    pub fn initialize_poll(ctx: Context<InitializePoll>, 
                             _poll_id: u64,
                             description:String,
                             start_date:u64,
                             end_date:u64,
                            ) -> Result<()> {
        
        let poll = &mut ctx.accounts.poll;
        poll.poll_id = _poll_id;
        poll.description = description;
        poll.start_date = start_date;
        poll.end_date = end_date;
        poll.canditates_amounts = 0 ;   
        poll.bump = ctx.bumps.poll;   
        Ok(())
    }
    pub fn initialze_canditate(ctx: Context<InitializeCanditate>,canditate_name: String) -> Result<()> {
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
#[instruction(canditate_name:String)]
pub struct InitializeCanditate<'info> {
    #[account(init,payer = signer , space = 8 + 8 , seeds = [canditate_name.as_ref()] , bump, )]
    pub candidate: Account<'info, Canditate>,
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
    pub description:String,
    pub start_date:u64,
    pub end_date:u64,
    pub canditates_amounts:u64
}

#[account]
#[derive(InitSpace)]
pub struct Canditate {
    #[max_len(32)]
    pub name: String,

}
