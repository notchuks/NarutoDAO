import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// Our governance contract
const vote = sdk.getVote("0x08FD5407e878cB0751Dc44f8a1291D5c7292381F");

// Our ERC-20 contract
const token = sdk.getToken("0xa7B9B6aAA2403e46eE93dEfad8Bb05CA28F5C798");

(async () => {
    try {
        // Create proposal to mint 420,000 new token to the treasury.
        const amount = 420_000;
        const description = `Should the DAO mint an additional ${amount} into the treasury?`;
        const executions = [
            {
                // Our token contract that actually executes the mint.
                toAddress: token.getAddress(),
                // Our nativeToken is ETH. nativeTokenValue is the amount of ETH we want
                // to send in this proposal. In this case, we're sending 0 ETH.
                // We're just minting new tokens to the treasury. So, set to 0.
                nativeTokenValue: 0,
                // We're doing a mint! And, we're minting to the vote, which is acting as our treasury.
                // in this case, we need to use ethers.js to convert the amount
                // to the correct format. This is because the amount it requires is in wei.
                transactionData: token.encoder.encode(
                    "mintTo", [
                        vote.getAddress(),
                        ethers.utils.parseUnits(amount.toString(), 18),
                    ]
                ),
            }
        ];

        await vote.propose(description, executions);

        console.log("✅ Successfully created proposal to mint tokens");
    } catch (err) {
        console.error("Failed to create first proposal", err);
        process.exit(1);
    }

    try {
        // Create proposal to transfer ourselves 6,900 tokens for being awesome.
        const amount = 6_900;
        const description = `Should the DAO transfer ${amount} tokens from the treasury to ${process.env.WALLET_ADDRESS} for being awesome?`;
        const executions = [
            {
                // Again, we're sending ourselves 0 ETH. Just sending our own token.
                nativeTokenValue: 0,
                transactionData: token.encoder.encode(
                    // We're doing a transfer from the treasury to our wallet.
                    "transfer",
                    [
                        process.env.WALLET_ADDRESS,
                        ethers.utils.parseUnits(amount.toString(), 18),
                    ]
                ),
                toAddress: token.getAddress(),
            }
        ]

        await vote.propose(description, executions);

        console.log("✅ Successfully created a proposal to reward ourselves from the treasury. Lets hope people vote for it!");
    } catch (err) {
        console.error("Failed to create second proposal", err);
        process.exit(1);
    }
})();
