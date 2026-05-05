<script setup>
import {onMounted, reactive, ref} from 'vue'
import BigNumber from "bignumber.js";
import {formatEther} from "ethers";
import {
  dailySellBnbLimit,
  dailySoldBnbAmount,
  setDailySellBnbLimit
} from "@/js/contracts/labubu";

const loading = reactive([false]);
const currentDailySoldBnbAmount = ref('0');
const currentDailySellBnbLimit = ref('0');
const expectDailySellBnbLimit = ref('');
const tip = ref('');

onMounted(async () => {
  await init()
})

async function init() {
  try {
    const [soldAmount, sellLimit] = await Promise.all([
      dailySoldBnbAmount(),
      dailySellBnbLimit()
    ]);
    currentDailySoldBnbAmount.value = formatEther(soldAmount?.toString?.() ?? soldAmount ?? '0');
    currentDailySellBnbLimit.value = formatEther(sellLimit?.toString?.() ?? sellLimit ?? '0');
  } catch (e) {
    console.log(e)
    currentDailySoldBnbAmount.value = '0';
    currentDailySellBnbLimit.value = '0';
  }
}

async function doSetDailySellBnbLimit() {
  if (loading[0]) return;
  if (!expectDailySellBnbLimit.value) {
    tip.value = '请输入今日最大卖出数量';
    return;
  }

  const limit = new BigNumber(expectDailySellBnbLimit.value);
  if (limit.isNaN() || limit.lt(0)) {
    tip.value = '今日最大卖出数量格式错误';
    return;
  }

  loading[0] = true;
  tip.value = '';
  try {
    const value = limit.multipliedBy(1e18).toFixed(0);
    await setDailySellBnbLimit(value);
    tip.value = '设置成功';
    expectDailySellBnbLimit.value = '';
    await init()
  } catch (e) {
    console.log(e)
    tip.value = '设置失败';
  } finally {
    loading[0] = false;
  }
}
</script>

<template>
  <div class="l-title">每日卖出数量</div>
  <div class="l-info mb10">
    <div class="left">今日卖出数量</div>
    <div class="right">{{ currentDailySoldBnbAmount }}</div>
  </div>
  <div class="l-info mb10">
    <div class="left">今日最大卖出数量</div>
    <div class="right">{{ currentDailySellBnbLimit }}</div>
  </div>
  <div class="l-input mb16" style="margin-top: 20px">
    <van-field v-model="expectDailySellBnbLimit" placeholder="输入今日最大卖出数量" />
  </div>
  <div v-if="loading[0]" class="l-btn">
    <van-loading size="22" type="circular" color="#FFF"/>
  </div>
  <div v-else class="l-btn" @click="doSetDailySellBnbLimit()">设置今日最大卖出数量</div>
  <div v-if="tip" class="l-info mt16">
    <div class="left">提示</div>
    <div class="right">{{ tip }}</div>
  </div>
  <div style="height: 20px;"></div>
</template>

<style scoped>
@import "@/views/admin/manage.scss";
</style>
