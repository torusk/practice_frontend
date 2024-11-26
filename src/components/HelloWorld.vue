<template>
  <div>
    <h1>{{ message }}</h1>
    <button @click="getNumber">Get Contract Number</button>
    <button @click="increment">Increment</button>
    <br /><br />
    <input type="text" v-model="inputText" placeholder="Enter text here" />
    <button @click="registAddress">Register address</button>
    <button @click="getRegisteredAddresses">Address list</button>
    <br /><br />
    <input type="text" v-model="inputTextAsset" placeholder="Enter text here" />
    <button @click="addAsset">Add asset</button>
    <button @click="getAsset">Load asset</button>
  </div>
</template>

<script>
import { ethers } from "ethers";
import { numberService, incrementService, registAddressService, getRegisteredAddressesService, addAssetService, getAssetService } from "@/blockchain/contractService";

export default {
  data() {
    return {
      inputText: "",
      message: "Fetching data..."
    };
  },
  async mounted() {
    // await this.getNumber();
    await this.getConnectedAddress();
  },
  methods: {
    async getNumber() {
      const value = await numberService();
      if (value) {
        this.message = value;
      } else {
        this.message = "データの取得に失敗しました．";
      }
    },
    async increment() {
      try {
        const tx = await incrementService();
        if (tx) {
          console.log("increment()実行成功:", tx.hash);
        } else {
          console.error("increment()の呼び出しに失敗しました");
        }
      } catch (error) {
        console.error("Vueコンポーネントでのエラー:", error);
      }
    },
    async registAddress() {
      if (this.inputText) {
        this.message = this.inputText;
        console.log("Registered address:", this.inputText);

        const tx = await registAddressService(this.inputText);
        if (tx) {
          console.log("registAddressService()実行成功:", tx.hash);
        } else {
          console.error("registAddressService()の呼び出しに失敗しました");
        }
      } else {
        this.message = "アドレスを入力してください．";
        console.warn("入力が空です．");
      }
    },
    async getRegisteredAddresses() {
      const value = await getRegisteredAddressesService();
      if (value) {
        this.message = value;
      } else {
        this.message = "データの取得に失敗しました．";
      }
    },
    async getConnectedAddress() {
      try {
        // MetaMaskのプロバイダーを取得
        const provider = new ethers.BrowserProvider(window.ethereum);

        // ユーザーにウォレット接続を要求
        const accounts = await provider.send("eth_requestAccounts", []);
        if (accounts && accounts.length > 0) {
          // 最初のアカウントを取得し、テキストボックスにセット
          this.inputText = accounts[0];
          console.log("Connected MetaMask address:", this.inputText);
        } else {
          console.warn("MetaMaskでアカウントが見つかりませんでした．");
        }
      } catch (error) {
        console.error("MetaMask接続中にエラーが発生しました:", error);
      }
    },
    async addAsset() {
      if (this.inputTextAsset) {
        this.message = this.inputTextAsset;

        const tx = await addAssetService(this.inputTextAsset);
        if (tx) {
          console.log("addAssetService()実行成功:", tx.hash);
        } else {
          console.error("addAssetService()の呼び出しに失敗しました");
        }
      } else {
        this.message = "登録したい資産額を入力してください．";
        console.warn("入力が空です．");
      }
    },
    async getAsset() {
      if (this.inputTextAsset) {
        this.message = this.inputTextAsset;

        const value = await getAssetService(this.inputTextAsset);
        if (value) {
          this.message = "address: "+this.inputTextAsset + " 資産額: " + value;
        } else {
          this.message = "データの取得に失敗しました．";
        }
      } else {
        this.message = "アドレスを入力してください．";
        console.warn("入力が空です．");
      }
      
    }
  }
};
</script>

<style scoped>
/* 必要であればスタイルを記述 */
</style>
