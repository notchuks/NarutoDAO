import sdk from "./1-initialize-sdk.js";

(async () => {
    try {
        const voteContractAddress = await sdk.deployer.deployVote({
            // Give your governance contract a name.
            name: "My amazing DAO",

            // Loaction of our ERC-20 contract. So we can only use our token to vote.
            voting_token_address: "0xa7B9B6aAA2403e46eE93dEfad8Bb05CA28F5C798",

            // These parameters are specified in number of blocks, assuming block time of around 13.14 seconds (for Ethereum)

            // After a proposal is created, when can members start voting? For now, we set this to immediately.
            voting_delay_in_blocks: 0,

            // Timeframe for voting; 1 day = 6570 blocks.
            voting_period_in_blocks: 6570,

            // The minimum % of the total supply needed for the proposal to pass after end of voting. 0 for testing.
            voting_quorum_fraction: 0,

            // minimum no. of tokens a user needs to be allowed to create a proposal.
            // 0, so any member(even without governance token) can create proposal.
            proposal_token_threshold: 0,
        });

        console.log("✅ Successfully deployed vote contract. Address: ", voteContractAddress);
    } catch (err) {
        console.error("Failed to deploy vote contract.", err);
    }
})();