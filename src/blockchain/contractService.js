import { ethers } from "ethers";
import contractData from "@/blockchain/abi/Counter.json";
import contractDataAssetManager from "@/blockchain/abi/AssetManager.json";

const provider = new ethers.JsonRpcProvider(process.env.VUE_APP_PROVIDER_URL);
const contractAddress = process.env.VUE_APP_CONTRACT_ADDRESS;
const contractABI = contractData.abi;
const contractABIAssetManager = contractDataAssetManager.abi;


async function _connectWallet() {
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

export async function numberService() {
    try {
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const value = await contract.number();
        return value.toString();
    } catch (error) {
        console.error("エラーが発生しました:", error);
        return null;
    }
}

export async function incrementService() {
    try {
        const signer = await _connectWallet();
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


export async function registAddressService(address) {
    try {
        const signer = await _connectWallet();
        if (!signer) throw new Error("ウォレットが接続されていません");
        
        if (!ethers.isAddress(address)) {
            throw new Error("無効なEthereumアドレスが入力されました");
        }

        const contractWithSigner = new ethers.Contract(contractAddress, contractABIAssetManager, signer);
        
        contractWithSigner.on("AddressRegistered", (registeredAddress) => {
            console.log("イベント：：登録されたアドレス:", registeredAddress);
            alert(`アドレスが登録されました: ${registeredAddress}`);
        });

        const tx = await contractWithSigner.registAddress(address);
        console.log("トランザクション送信中:", tx.hash);

        await tx.wait(); 
        console.log("トランザクションが完了しました:", tx.hash);

        return tx;
    } catch (error) {
        console.error("エラーが発生しました:", error);
        return null;
    }
}

export async function getRegisteredAddressesService() {
    try {
        const contract = new ethers.Contract(contractAddress, contractABIAssetManager, provider);
        const addresses = await contract.getRegisteredAddresses();
        console.log("登録されているアドレス:", addresses);
        const addressesString = addresses.map((address) => address.toString()).join(", ");
        console.log("登録されているアドレス:", addressesString);
        return addressesString;
    } catch (error) {
        console.error("エラーが発生しました:", error);
        return null;
    }
}