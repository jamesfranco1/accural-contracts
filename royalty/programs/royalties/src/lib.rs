use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("5qw1oP8MLMdtPWrtjdpt2nHWZykTHVEZH1NpYaX8aj9b");

#[program]
pub mod royalties {
    use super::*;

    /// Initialize the platform configuration
    pub fn initialize(ctx: Context<Initialize>, platform_fee_bps: u16) -> Result<()> {
        instructions::initialize::handler(ctx, platform_fee_bps)
    }

    /// Creator lists royalties for sale - mints NFT representing ownership
    pub fn create_listing(
        ctx: Context<CreateListing>,
        args: CreateListingArgs,
    ) -> Result<()> {
        instructions::create_listing::handler(ctx, args)
    }

    /// Buyer purchases a royalty listing from primary market (USDC)
    pub fn buy_listing(ctx: Context<BuyListing>) -> Result<()> {
        instructions::buy_listing::handler(ctx)
    }

    /// Buyer purchases a royalty listing from primary market (SOL)
    pub fn buy_listing_sol(ctx: Context<BuyListingSol>) -> Result<()> {
        instructions::buy_listing_sol::handler(ctx)
    }

    /// Creator cancels their listing (before it's sold)
    pub fn cancel_listing(ctx: Context<CancelListing>) -> Result<()> {
        instructions::cancel_listing::handler(ctx)
    }

    /// List a royalty token for resale on secondary market
    pub fn list_for_resale(
        ctx: Context<ListForResale>,
        price: u64,
        price_sol: u64,
    ) -> Result<()> {
        instructions::list_for_resale::handler(ctx, price, price_sol)
    }

    /// Buy a royalty token from secondary market (USDC)
    pub fn buy_resale(ctx: Context<BuyResale>) -> Result<()> {
        instructions::buy_resale::handler(ctx)
    }

    /// Buy a royalty token from secondary market (SOL)
    pub fn buy_resale_sol(ctx: Context<BuyResaleSol>) -> Result<()> {
        instructions::buy_resale_sol::handler(ctx)
    }

    /// Cancel a resale listing
    pub fn cancel_resale(ctx: Context<CancelResale>) -> Result<()> {
        instructions::cancel_resale::handler(ctx)
    }

    /// Creator deposits payout for royalty holders
    pub fn deposit_payout(ctx: Context<DepositPayout>, amount: u64) -> Result<()> {
        instructions::deposit_payout::handler(ctx, amount)
    }

    /// Holder claims their share of the payout
    pub fn claim_payout(ctx: Context<ClaimPayout>) -> Result<()> {
        instructions::claim_payout::handler(ctx)
    }

    /// Pause the platform (admin only)
    pub fn pause_platform(ctx: Context<PausePlatform>) -> Result<()> {
        instructions::pause_platform::handler(ctx)
    }

    /// Unpause the platform (admin only)
    pub fn unpause_platform(ctx: Context<UnpausePlatform>) -> Result<()> {
        instructions::unpause_platform::handler(ctx)
    }

    /// Update platform fees (admin only)
    pub fn update_platform_fees(ctx: Context<UpdatePlatformFees>, args: UpdateFeesArgs) -> Result<()> {
        instructions::update_platform_fees::handler(ctx, args)
    }

    /// Withdraw accumulated fees (admin only)
    pub fn withdraw_fees(ctx: Context<WithdrawFees>) -> Result<()> {
        instructions::withdraw_fees::handler(ctx)
    }
}

