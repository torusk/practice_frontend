<template>
  <div>
    <h1>{{ message }}</h1>
    <!-- <button @click="getNumber">Get Contract Number</button>
    <button @click="increment">Increment</button> -->
    <br /><br />
    <input type="text" v-model="inputText" placeholder="Enter text here" />
    <button @click="registAddress">Register address</button>
    <button @click="getRegisteredAddresses">Address list</button>
    <br /><br />
    <input type="text" v-model="inputTextAsset" placeholder="Enter text here" />
    <button @click="addAsset">Add asset</button>
    <button @click="getAsset">Load asset</button>
    <br /><br />
    
    <input type="text" v-model="inputTextFileSelected" placeholder="" style="width: 400px;" />
    <button @click="triggerFileSelect">ファイルを選択</button>
    <div>
      <p>ハッシュ値: {{ fileHash }}</p>
    </div>
    <input ref="fileInput" type="file" @change="handleFileSelect" style="display: none" />
    <button @click="addAssetWithHash">Add asset with a file hash</button>
    <button @click="getAssetWithHash">Load asset with a file hash</button>
  </div>
</template>

<script>
import { ethers } from "ethers";
import { //numberService, incrementService, 
  registAddressService, getRegisteredAddressesService, addAssetService, getAssetService, addAssetWithHashService, getAssetWithHashService } from "@/blockchain/contractService";
import { ref } from 'vue';

// HEX文字列をバイト配列に変換する関数
function hexToBytes(hex) {
  if (!hex || typeof hex !== "string") {
    throw new Error("無効なHEX文字列です．");
  }

  if (hex.length % 2 !== 0) {
    throw new Error("HEX文字列の長さは偶数でなければなりません．");
  }

  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

export default {
  setup() {
    const inputTextAsset = ref("");
    const fileInput = ref(null);
    const inputTextFileSelected = ref(""); // 選択されたファイル名を保持
    const fileHash = ref("");
    
    const triggerFileSelect = () => {
      fileInput.value.click();
    };

    const handleFileSelect = async (event) => {
      if (event.target.files[0]) {
        inputTextFileSelected.value = event.target.files[0].name; // ファイル名を表示

        try {
          // ハッシュ値を計算
          fileHash.value = await calculateFileHash(event.target.files[0]);
          console.log("計算されたハッシュ値:", fileHash.value);
        } catch (error) {
          console.error("ハッシュ計算中にエラーが発生しました:", error);
          alert("ハッシュ計算に失敗しました．");
        }
      } else {
        inputTextFileSelected.value = "";
        fileHash.value = "";
      }
    };
    
    const calculateFileHash = async (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileBuffer = new Uint8Array(e.target.result);
          crypto.subtle.digest("SHA-256", fileBuffer).then((hashBuffer) => {
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
            resolve(hashHex);
          }).catch(reject);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
      });
    };

    return {
      inputTextAsset,
      fileInput,
      fileHash,
      inputTextFileSelected,
      triggerFileSelect,
      handleFileSelect,
      calculateFileHash
    };
  },
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
    // async getNumber() {
    //   const value = await numberService();
    //   if (value) {
    //     this.message = value;
    //   } else {
    //     this.message = "データの取得に失敗しました．";
    //   }
    // },
    // async increment() {
    //   try {
    //     const tx = await incrementService();
    //     if (tx) {
    //       console.log("increment()実行成功:", tx.hash);
    //     } else {
    //       console.error("increment()の呼び出しに失敗しました");
    //     }
    //   } catch (error) {
    //     console.error("Vueコンポーネントでのエラー:", error);
    //   }
    // },
    async registAddress() {
      if (this.inputText) {
        this.message = "アドレス登録中．．．：" + this.inputText;
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
        this.message = "登録済みアドレス：" + value;
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
        this.message = "資産登録中．．．：" + this.inputTextAsset;

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
          this.message = "address: " + this.inputTextAsset + " 資産額: " + value;
        } else {
          this.message = "データの取得に失敗しました．";
        }
      } else {
        this.message = "アドレスを入力してください．";
        console.warn("入力が空です．");
      }
    },
    async addAssetWithHash() {
      if (this.inputTextAsset) {
        this.message = "資産登録中(ファイルハッシュも)．．．：" + this.inputTextAsset;
        
        
        const fileHashBytes = hexToBytes(this.fileHash);

        const tx = await addAssetWithHashService(this.inputTextAsset, fileHashBytes);
        if (tx) {
          console.log("addAssetWithHashService()実行成功:", tx.hash);
        } else {
          console.error("addAssetWithHashService()の呼び出しに失敗しました");
        }
      } else {
        this.message = "登録したい資産額を入力してください．";
        console.warn("入力が空です．");
      }
    },
    async getAssetWithHash() {
      if (this.inputTextAsset) {
        this.message = this.inputTextAsset;

        const value = await getAssetWithHashService(this.inputTextAsset);
        if (value) {
          this.message = "address: " + this.inputTextAsset + " 資産額とハッシュ値: " + value;
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
