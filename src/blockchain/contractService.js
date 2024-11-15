import { ethers } from "ethers";
import contractData from "@/blockchain/abi/Counter.json";

const provider = new ethers.JsonRpcProvider(process.env.VUE_APP_PROVIDER_URL);
const contractAddress = process.env.VUE_APP_CONTRACT_ADDRESS;
const contractABI = contractData.abi;


export async function getContractValue() {
    try {
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const value = await contract.number();
        return value.toString();
    } catch (error) {
        console.error("エラーが発生しました:", error);
        return null;
    }
}

export async function connectWallet() {
    try {
        const { ethereum } = window;
        if (!ethereum) {
            throw new Error("MetaMaskがインストールされていません");
        }
        const signer = new ethers.BrowserProvider(ethereum).getSigner();
        return signer;
    } catch (error) {
        console.error("ウォレット接続エラー:", error);
        return null;
    }
}

export async function incrementCounter() {
    try {
        const signer = await connectWallet();
        if (!signer) throw new Error("ウォレットが接続されていません");

        const contractWithSigner = new ethers.Contract(contractAddress, contractABI, signer);
        const tx = await contractWithSigner.increment();
        console.log("トランザクション送信中:", tx.hash);

        await tx.wait(); // トランザクションがマイニングされるまで待機
        console.log("トランザクションが完了しました:", tx.hash);

        return tx;
    } catch (error) {
        console.error("increment()の呼び出しエラー:", error);
        return null;
    }
}