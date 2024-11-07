import { ethers } from "ethers";
import contractData from "@/blockchain/abi/Counter.json";

const provider = new ethers.JsonRpcProvider("http://localhost:8545");
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
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
