<script setup>
import {onMounted, reactive, ref} from 'vue'
import BigNumber from "bignumber.js";
import {
  sellFeeDeclineMultiplier,
  sellFeeRate,
  setSellFeeDeclineMultiplier,
  setSellFeeRate
} from "@/js/contracts/labubu";

const loading = reactive([false, false]);
const currentSellFeeRate = ref('0');
const expectSellFeeRate = ref('');
const currentSellFeeDeclineMultiplier = ref('0');
const expectSellFeeDeclineMultiplier = ref('');
const tip = reactive(['', '']);

onMounted(async () => {
  await init()
})

async function init() {
  try {
    const rate = await sellFeeRate();
    currentSellFeeRate.value = new BigNumber(rate?.toString?.() ?? rate ?? '0')
      .dividedBy(100)
      .toFixed(2);
  } catch (e) {
    console.log(e)
    currentSellFeeRate.value = '0';
  }

  try {
    const multiplier = await sellFeeDeclineMultiplier();
    currentSellFeeDeclineMultiplier.value = multiplier?.toString?.() ?? multiplier ?? '0';
  } catch (e) {
    console.log(e)
    currentSellFeeDeclineMultiplier.value = '0';
  }
}

async function doSetSellFeeRate() {
  if (loading[0]) return;
  if (!expectSellFeeRate.value) {
    tip[0] = '请输入卖出手续费';
    return;
  }

  const rate = new BigNumber(expectSellFeeRate.value);
  if (rate.isNaN() || rate.lt(0)) {
    tip[0] = '卖出手续费格式错误';
    return;
  }
  if (rate.decimalPlaces() > 2) {
    tip[0] = '卖出手续费最多2位小数';
    return;
  }

  loading[0] = true;
  tip[0] = '';
  try {
    const value = rate.multipliedBy(100).toFixed(0);
    await setSellFeeRate(value);
    tip[0] = '设置成功';
    expectSellFeeRate.value = '';
    await init()
  } catch (e) {
    console.log(e)
    tip[0] = '设置失败';
  } finally {
    loading[0] = false;
  }
}

async function doSetSellFeeDeclineMultiplier() {
  if (loading[1]) return;
  if (!expectSellFeeDeclineMultiplier.value) {
    tip[1] = '请输入N值';
    return;
  }

  const multiplier = new BigNumber(expectSellFeeDeclineMultiplier.value);
  if (multiplier.isNaN() || multiplier.lt(0)) {
    tip[1] = 'N值格式错误';
    return;
  }

  loading[1] = true;
  tip[1] = '';
  try {
    await setSellFeeDeclineMultiplier(multiplier.toFixed());
    tip[1] = '设置成功';
    expectSellFeeDeclineMultiplier.value = '';
    await init()
  } catch (e) {
    console.log(e)
    tip[1] = '设置失败';
  } finally {
    loading[1] = false;
  }
}
</script>

<template>
  <div class="l-title">基础手续费设置：跌幅5%以内，按照基础手续费</div>
  <div class="l-info mb10">
    <div class="left">当前基础手续费</div>
    <div class="right">{{ currentSellFeeRate }}%</div>
  </div>
  <div class="l-input mb16" style="margin-top: 20px">
    <van-field v-model="expectSellFeeRate" placeholder="输入卖出手续费(1%输入1)" />
  </div>
  <div v-if="loading[0]" class="l-btn">
    <van-loading size="22" type="circular" color="#FFF"/>
  </div>
  <div v-else class="l-btn" @click="doSetSellFeeRate()">设置卖出手续费</div>
  <div v-if="tip[0]" class="l-info mt16">
    <div class="left">提示</div>
    <div class="right">{{ tip[0] }}</div>
  </div>
  <div style="height: 20px;"></div>

  <div class="l-title">弹性手续费设置：跌5%以上，手续费跌幅*N</div>
  <div class="l-info mb10">
    <div class="left">N值</div>
    <div class="right">{{ currentSellFeeDeclineMultiplier }}</div>
  </div>
  <div class="l-input mb16" style="margin-top: 20px">
    <van-field v-model="expectSellFeeDeclineMultiplier" placeholder="输入N值" />
  </div>
  <div v-if="loading[1]" class="l-btn">
    <van-loading size="22" type="circular" color="#FFF"/>
  </div>
  <div v-else class="l-btn" @click="doSetSellFeeDeclineMultiplier()">设置N值</div>
  <div v-if="tip[1]" class="l-info mt16">
    <div class="left">提示</div>
    <div class="right">{{ tip[1] }}</div>
  </div>
  <div style="height: 20px;"></div>
</template>

<style scoped>
@import "@/views/admin/manage.scss";
</style>
