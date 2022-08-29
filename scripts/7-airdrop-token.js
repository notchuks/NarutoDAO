import sdk from "./1-initialize-sdk.js";

// address to our ERC-1155 membership NFT contract
const editionDrop = sdk.getEditionDrop("0xBd69582b6D9c71FBAf986076ae15768Ac7cc2490");

// address to our ERC-20 token contract
const token = sdk.getToken("0xa7B9B6aAA2403e46eE93dEfad8Bb05CA28F5C798");

(async () => {
    try {
        // Grab all the addresses of people who own our NFT that has id 0
        const walletAddresses = await editionDrop.history.getAllClaimerAddresses(0);

        if (walletAddresses.length === 0) {
            console.log("No NFTs have been claimed yet, maybe get some friends to claim your free NFTs.");
            process.exit(0);
        };

        // Loop through the array of addresses
        const airdropTargets = walletAddresses.map((address) => {
            // Pick a random # between 1000 & 10000
            const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
            console.log(`Going to airdrop ${randomAmount} tokens to ${address}`);

            // set up the target
            const airdropTarget = {
                toAddress: address,
                amount: randomAmount,
            };

            return airdropTarget;
        })

        // Call transferbatch on all our targets
        console.log("🌈 Starting airdrop...");
        await token.transferBatch(airdropTargets);
        console.log("✅ Successfully airdropped tokens to all holders of the NFT!");
    } catch (err) {
        console.log("Failed to airdrop tokens", err);
    }
})();