<script setup>
import {onMounted, reactive, ref} from 'vue'
import BigNumber from "bignumber.js";
import {sellFeeRate, setSellFeeRate} from "@/js/contracts/labubu";

const loading = reactive([false]);
const currentSellFeeRate = ref('0');
const expectSellFeeRate = ref('');
const tip = ref('');

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
}

async function doSetSellFeeRate() {
  if (loading[0]) return;
  if (!expectSellFeeRate.value) {
    tip.value = '请输入卖出手续费';
    return;
  }

  const rate = new BigNumber(expectSellFeeRate.value);
  if (rate.isNaN() || rate.lt(0)) {
    tip.value = '卖出手续费格式错误';
    return;
  }
  if (rate.decimalPlaces() > 2) {
    tip.value = '卖出手续费最多2位小数';
    return;
  }

  loading[0] = true;
  tip.value = '';
  try {
    const value = rate.multipliedBy(100).toFixed(0);
    await setSellFeeRate(value);
    tip.value = '设置成功';
    expectSellFeeRate.value = '';
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
  <div class="l-title">卖出手续费设置</div>
  <div class="l-info mb10">
    <div class="left">当前卖出手续费</div>
    <div class="right">{{ currentSellFeeRate }}%</div>
  </div>
  <div class="l-input mb16" style="margin-top: 20px">
    <van-field v-model="expectSellFeeRate" placeholder="输入卖出手续费(1%输入1)" />
  </div>
  <div v-if="loading[0]" class="l-btn">
    <van-loading size="22" type="circular" color="#FFF"/>
  </div>
  <div v-else class="l-btn" @click="doSetSellFeeRate()">设置卖出手续费</div>
  <div v-if="tip" class="l-info mt16">
    <div class="left">提示</div>
    <div class="right">{{ tip }}</div>
  </div>
  <div style="height: 20px;"></div>
</template>

<style scoped>
@import "@/views/admin/manage.scss";
</style>
