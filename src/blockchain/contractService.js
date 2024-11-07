import { ethers } from "ethers";
import contractData from "@/blockchain/abi/Counter.json";

const provider = new ethers.JsonRpcProvider(process.env.VUE_APP_PROVIDER_URL);
const contractAddress = process.env.VUE_APP_CONTRACT_ADDRESS;
const contractABI = contractData.abi;

const contract = new ethers.Contract(contractAddress, contractABI, provider);

export async function getContractValue() {
    try {
        const value = await contract.number();
        return value.toString();
    } catch (error) {
        console.error("エラーが発生しました:", error);
        return null;
    }
}
