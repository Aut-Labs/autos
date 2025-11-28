import { ethers } from "ethers";

const AUTID_ABI = [
    "function balanceOf(address owner) public view returns (uint256)",
    "function tokenIdForAccount(address account) public view returns (uint256)"
];

const AUTID_CONTRACT_ADDRESS = "0x322Cec04d63CDCba9410026B033dEc1015EC346d";
const AMOY_RPC_URL = "https://polygon-amoy.g.alchemy.com/v2/Skyi471bo5qu1UFfGLHf-DDo0kgKHeXW";

/**
 * Check if an address has an ĀutID NFT
 * @param address The wallet address to check
 * @returns true if the address owns an ĀutID, false otherwise
 */
export const hasAutID = async (address: string): Promise<boolean> => {
    try {
        const provider = new ethers.JsonRpcProvider(AMOY_RPC_URL);
        const autIDContract = new ethers.Contract(
            AUTID_CONTRACT_ADDRESS,
            AUTID_ABI,
            provider
        );

        const balance = await autIDContract.balanceOf(address);
        return balance > 0;
    } catch (error) {
        console.error("Error checking AutID existence:", error);
        return false; // Default to false if check fails
    }
};

/**
 * Get the ĀutID token ID for an address
 * @param address The wallet address
 * @returns The token ID or 0 if no ĀutID exists
 */
export const getAutIDTokenId = async (address: string): Promise<number> => {
    try {
        const provider = new ethers.JsonRpcProvider(AMOY_RPC_URL);
        const autIDContract = new ethers.Contract(
            AUTID_CONTRACT_ADDRESS,
            AUTID_ABI,
            provider
        );

        const tokenId = await autIDContract.tokenIdForAccount(address);
        return Number(tokenId);
    } catch (error) {
        console.error("Error getting AutID token ID:", error);
        return 0;
    }
};
