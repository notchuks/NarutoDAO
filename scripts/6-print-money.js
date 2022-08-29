import sdk from "./1-initialize-sdk.js";

// ERC-20 token address
const token = sdk.getToken("0xa7B9B6aAA2403e46eE93dEfad8Bb05CA28F5C798");

(async () => {
    try {
        // max supply of token
        const amount = 1_000_000;
        // interact with deployed erc-20 contract and mint tokens
        await token.mintToSelf(amount);
        const totalSupply = await token.totalSupply();

        // Print out how many of the tokens are in circulation now
        console.log(`✅ There are now ${totalSupply.displayValue} $HOKAGE in circulation.`);
    } catch (err) {
        console.log("Failed to print money", err);
    }
})();