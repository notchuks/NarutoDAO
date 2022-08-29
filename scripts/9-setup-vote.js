import sdk from "./1-initialize-sdk.js";

// Our governance(vote) contract.
const vote = sdk.getVote("0x08FD5407e878cB0751Dc44f8a1291D5c7292381F");

// our ERC-20 contract.
const token = sdk.getToken("0xa7B9B6aAA2403e46eE93dEfad8Bb05CA28F5C798");

(async () => {
    try {
        // Give our treasury the power to mint additional token if needed.
        await token.roles.grant("minter", vote.getAddress());
        console.log("✅ Successfully gave vote contract permissions to act on token contract.")
    } catch (err) {
        console.error("Failed to grant vote contract permissions on token contract.", err);
        process.exit(1);
    }

    try {
        // Grab our wallet's token balance, remember -- we hold the entire supply right now!
        const ownedTokenBalance = await token.balanceOf(process.env.WALLET_ADDRESS);

        // Grab 90% of our owned tokens
        const ownedAmount = ownedTokenBalance.displayValue;
        const percent90 = Number(ownedAmount) / 100 * 90;

        // Transfer 90% of the supply to our voting contract.
        await token.transfer(vote.getAddress(), percent90);

        console.log(`✅ Successfully transferred ${percent90} tokens to vote contract.`);
    } catch (err) {
        console.error("Failed to transfer tokens to vote contract.", err);
    }
})();