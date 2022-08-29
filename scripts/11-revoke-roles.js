import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken("0xa7B9B6aAA2403e46eE93dEfad8Bb05CA28F5C798");

(async () => {
    try {
        const allRoles = await token.roles.getAll();

        console.log("👀 Roles that exist right now: ", allRoles);

        // Revoke all the superpowers your wallet had over the ERC-20 contract.
        await token.roles.setAll({
            admin: [],
            minter: ["0x08FD5407e878cB0751Dc44f8a1291D5c7292381F"],
        });

        console.log("🎉 Roles after revoking ourselves: ", await token.roles.getAll());
        console.log("✅ Successfully revoked our superpower roles from the ERC-20 contract");
    } catch (err) {
        console.error("Failed to revoke ourselves from the DAO treasury", err);
    }
})();

// note: here farza revoked roles for all addresses, plus the smart contract. so i just revoked my admin role
// and leave the smart contract as a minter.