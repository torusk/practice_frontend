<template>
  <div>
    <h1>{{ message }}</h1>
    <button @click="getNumber">Get Contract Number</button>
    <button @click="increment">Increment</button>
    <br /><br />
    <input type="text" v-model="inputText" placeholder="Enter text here" />
    <button @click="registAddress">Register address</button>
    <button @click="getRegisteredAddresses">Address list</button>
  </div>
</template>

<script>
import { numberService, incrementService, registAddressService, getRegisteredAddressesService } from "@/blockchain/contractService";

export default {
  data() {
    return {
      message: "Fetching data..."
    };
  },
  async mounted() {
    // await this.getNumber();
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
    }
  }
};
</script>

<style scoped>
/* 必要であればスタイルを記述 */
</style>
