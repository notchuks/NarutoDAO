import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";

(async () => {
    try {
        // Deploy a standard ERC-20 contract
        const tokenAddress = await sdk.deployer.deployToken({
            // Token name
            name: "NarutoDAO Governance Token",
            symbol: "HOKAGE",
            // In case we want to sell our token. We dont so its set to addressZero.
            primary_sale_recipient: AddressZero,
        });

        console.log("✅ Successfully deployed token module. Address: ", tokenAddress);
    } catch (err) {
        console.log("Failed to deploy token module", err);
    }
})();