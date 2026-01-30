<script setup>
import {onMounted, reactive, ref} from 'vue'
import {getMaxAmount, setMaxAmount} from "@/js/contracts/labubu";
import {formatEther} from "ethers";

const loading = reactive([false]);
const maxAmount = ref('0');
const expectMaxAmount = ref('');

onMounted(async () => {
  await init()
})

async function init() {
  maxAmount.value = formatEther(await getMaxAmount());
}

async function doSetMaxAmount() {
  if (loading[0]) return;
  loading[0] = true;
  try {
    await setMaxAmount(expectMaxAmount.value);
  } catch (e) {
    console.log(e)
  }
  loading[0] = false;
  expectMaxAmount.value = ''
  await init()
}


</script>
<template>
  <div class="l-info mb10">
    <div class="left">最大入金数量</div>
    <div class="right">{{ maxAmount }}</div>
  </div>
  <div class="l-input mb16" style="margin-top: 20px">
    <van-field v-model="expectMaxAmount" placeholder="输入最大入金金额"/>
  </div>

  <div v-if="loading[0]" class="l-btn">
    <van-loading size="22" type="circular" color="#FFF"/>
  </div>
  <div v-else class="l-btn" @click="doSetMaxAmount()">设置</div>
  <div style="height: 20px;"></div>
</template>
<style scoped>
@import "@/views/admin/manage.scss";
</style>
