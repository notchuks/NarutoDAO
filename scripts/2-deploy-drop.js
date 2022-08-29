import { AddressZero } from "@ethersproject/constants";
import { readFileSync } from "fs";

import sdk from "./1-initialize-sdk.js";

(async () => {
    try {
        const editionDropAddress = await sdk.deployer.deployEditionDrop({
            // The collection's name; e.g cryptopunks
            name: "NarutoDAO membership",
            // Description for the collection
            description: "A DAO for fans of Naruto.",
            // The image that will be held be NFT members
            image: readFileSync("scripts/assets/naruto.png"),
            // We need to pass in the address of the person who will be receiving the proceeds from sales of nfts in the contract.
            // We're planning on not charging people for the drop, so we'll pass in the 0x0 address
            // you can set this to your own wallet address if you want to charge for the drop.
            primary_sale_recipient: AddressZero,
        });

        // this initialization returns the address of our contract
        // we use this to initialize the contract on the thirdweb sdk
        const editionDrop = sdk.getEditionDrop(editionDropAddress);

        // get contract metadata
        const metadata = await editionDrop.metadata.get();

        console.log("Successfully deployed editionDrop contract. Address: ", editionDropAddress);
        console.log("editionDrop metadata: ", metadata);

    } catch (err) {
        console.log("Failed to deploy editionDrop contract.", err);
    }
})();



