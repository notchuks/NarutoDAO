import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const editionDrop = sdk.getEditionDrop("0xBd69582b6D9c71FBAf986076ae15768Ac7cc2490");

(async () => {
    try {
        await editionDrop.createBatch([
            {
                name: "Leaf Village Headband",
                description: "This NFT will give you access to NarutoDAO!",
                image: readFileSync("scripts/assets/headband.png"),
            },
        ]);
        console.log("✅ Successfully created a new NFT in the drop!");
    } catch (err) {
        console.log("Failed to create the new NFT", err);
    }
})();