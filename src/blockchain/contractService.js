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

export async function addAssetService(amount) {
    try {
        console.log("amount:", amount);

        // 引数のチェック：正の整数か確認
        const parsedAmount = Number(amount); // 数値に変換
        if (!Number.isInteger(parsedAmount) || parsedAmount <= 0) {
            throw new Error("資産額は正の整数でなければなりません");
        }

        const signer = await _connectWallet();
        if (!signer) throw new Error("ウォレットが接続されていません");

        const contractWithSigner = new ethers.Contract(contractAddress, contractABIAssetManager, signer);

        contractWithSigner.on("AssetUpdated", (updatedAmount) => {
            console.log("イベント：：登録された資産:", updatedAmount);
            alert(`資産が追加されました: ${updatedAmount}`);
        });

        const tx = await contractWithSigner.addAsset(parsedAmount);
        console.log("トランザクション送信中:", tx.hash);

        await tx.wait();
        console.log("トランザクションが完了しました:", tx.hash);

        return tx;
    } catch (error) {
        console.error("エラーが発生しました:", error);
        return null;
    }
}

export async function getAssetService(address) {
    try {
        const contract = new ethers.Contract(contractAddress, contractABIAssetManager, provider);
        const assetValue = await contract.getAsset(address);
        console.log("取得した資産額:", assetValue);

        // 資産額を文字列に変換して返す
        const assetString = assetValue.toString();
        return assetString;
    } catch (error) {
        console.error("エラーが発生しました:", error);
        return null;
    }
}

export async function addAssetWithHashService(amount, hash) {
    try {
        console.log("amount:", amount, "hash:", hash);

        // 引数のチェック：正の整数か確認
        const parsedAmount = Number(amount); // 数値に変換
        if (!Number.isInteger(parsedAmount) || parsedAmount <= 0) {
            throw new Error("資産額は正の整数でなければなりません");
        }

        const signer = await _connectWallet();
        if (!signer) throw new Error("ウォレットが接続されていません");

        const contractWithSigner = new ethers.Contract(contractAddress, contractABIAssetManager, signer);

        contractWithSigner.on("AssetUpdated", (updatedAmount) => {
            console.log("イベント：：登録された資産:", updatedAmount);
            alert(`資産が追加されました: ${updatedAmount}`);
        });

        const tx = await contractWithSigner.addAssetWithHash(parsedAmount, hash);
        console.log("トランザクション送信中:", tx.hash);

        await tx.wait();
        console.log("トランザクションが完了しました:", tx.hash);

        return tx;
    } catch (error) {
        console.error("エラーが発生しました:", error);
        return null;
    }
}


export async function getAssetWithHashService(address) {
    try {
        const contract = new ethers.Contract(contractAddress, contractABIAssetManager, provider);
        const assetValue = await contract.getAsset(address);
        console.log("取得した資産額:", assetValue);

        // 資産額を文字列に変換して返す
        const assetString = assetValue.toString();

        const hashValue = await contract.getHash(address);
        console.log("hashValue type:", typeof hashValue, "hashValue:", hashValue);
        let ret = assetString + ": ";
        for (let i = 0; i < hashValue.length; i++) {
            console.log("hashValue:", hashValue[i]);
            ret += hashValue[i] + " ";
        }

        return ret;

    } catch (error) {
        console.error("エラーが発生しました:", error);
        return null;
    }
}