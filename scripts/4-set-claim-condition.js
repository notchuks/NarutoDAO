import sdk from "./1-initialize-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

const editionDrop = sdk.getEditionDrop("0xBd69582b6D9c71FBAf986076ae15768Ac7cc2490");

(async () => {
    try {
        // We define our claim conditions, this is an array of objects because we can have multiple phases starting at different times if we want to.
        const claimConditions = [{
            // when people are going to start being able to claim NFTs(now)
            startTime: new Date(),
            // maximum no. of NFTs that can be claimed
            maxQuantity: 50_000,
            // Price of our NFT(free)
            price: 0,
            // Amount of NFts that can be claimed per transaction
            quantityLimitPerTransaction: 1,
            // We set the wait between transactions to MaxUint256, which means people are only allowed to claim once.
            waitInSeconds: MaxUint256,
        }];

        await editionDrop.claimConditions.set("0", claimConditions);
        console.log("✅ Successfully set claim condition!");
    } catch (err) {
        console.log("Failed to set claim condition", err);
    }
})();