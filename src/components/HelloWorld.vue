<template>
  <div>
    <h1>{{ message }}</h1>
    <button @click="fetchMessage">Fetch Contract Value</button>
  </div>
</template>

<script>
import { getContractValue } from "@/blockchain/contractService";

export default {
  data() {
    return {
      message: "Fetching data..."
    };
  },
  async mounted() {
    await this.fetchMessage();
  },
  methods: {
    async fetchMessage() {
      const value = await getContractValue();
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
