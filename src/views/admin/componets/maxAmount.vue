<script setup>
import {onMounted, reactive, ref} from 'vue'
import {getMaxAmount, setMaxAmount} from "@/js/contracts/labubu";
import {formatEther} from "ethers";
import {getMaxDailyAmount, setMaxDailyAmount} from "@/js/contracts/labubuNFT";

const loading = reactive([false, false]);
const maxAmount = ref('0');
const expectMaxAmount = ref('');
const maxDailyAmount = ref('')
const expectMaxDailyAmount = ref('')

onMounted(async () => {
  await init()
})

async function init() {
  maxAmount.value = formatEther(await getMaxAmount());
  maxDailyAmount.value = formatEther(await getMaxDailyAmount());
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

async function doSetMaxDailyAmount() {
  if (loading[1]) return;
  loading[1] = true;
  try {
    await setMaxDailyAmount(expectMaxDailyAmount.value);
  } catch (e) {
    console.log(e)
  }
  loading[1] = false;
  expectMaxDailyAmount.value = ''
  await init()
}

</script>
<template>
  <div class="l-info mb10">
    <div class="left">用户最大入金数量</div>
    <div class="right">{{ maxAmount }}</div>
  </div>
  <div class="l-input mb16" style="margin-top: 20px">
    <van-field v-model="expectMaxAmount" placeholder="输入用户最大入金金额"/>
  </div>
  <div v-if="loading[0]" class="l-btn">
    <van-loading size="22" type="circular" color="#FFF"/>
  </div>
  <div v-else class="l-btn" @click="doSetMaxAmount()">设置</div>
  <div style="height: 20px;"></div>

  <!--日最大入金数量-->
  <div class="l-info mb10">
    <div class="left">每日最大入金数量</div>
    <div class="right">{{ maxDailyAmount }}</div>
  </div>
  <div class="l-input mb16" style="margin-top: 20px">
    <van-field v-model="expectMaxDailyAmount" placeholder="输入每日最大入金金额"/>
  </div>
  <div v-if="loading[1]" class="l-btn">
    <van-loading size="22" type="circular" color="#FFF"/>
  </div>
  <div v-else class="l-btn" @click="doSetMaxDailyAmount()">设置</div>
</template>
<style scoped>
@import "@/views/admin/manage.scss";
</style>
