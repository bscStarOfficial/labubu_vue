<script setup>
import {ref, reactive} from 'vue';
import BigNumber from "bignumber.js";
import {userInfo, setShare, sendReward} from "@/js/contracts/swapFeeDividend";

const address = ref('');
const shareInput = ref('');
const rewardAmount = ref('');
const loading = reactive({
  query: false,
  setShare: false,
  sendReward: false,
});
const shareInfo = ref({
  share: '0',
  rewardDebt: '0',
  available: '0',
});
const tip = ref('');

function formatValue(value) {
  if (value === null || value === undefined) return '0';
  if (typeof value === 'string') return value;
  if (value.toString) return value.toString();
  return String(value);
}

async function queryWeight() {
  if (!address.value) {
    tip.value = '请输入用户地址';
    return;
  }
  loading.query = true;
  tip.value = '';
  try {
    const info = await userInfo(address.value);
    shareInfo.value = {
      share: formatValue(info.share),
      rewardDebt: formatValue(info.rewardDebt),
      available: formatValue(info.available),
    };
  } catch (e) {
    console.error(e);
    tip.value = '查询失败，请检查地址';
  } finally {
    loading.query = false;
  }
}

async function handleSetShare() {
  if (!address.value) {
    tip.value = '请先输入并查询用户地址';
    return;
  }
  if (!shareInput.value) {
    tip.value = '请输入要设置的权重';
    return;
  }
  loading.setShare = true;
  tip.value = '';
  try {
    await setShare(address.value, shareInput.value);
    tip.value = '设置成功';
    shareInput.value = '';
    await queryWeight();
  } catch (e) {
    console.error(e);
    tip.value = '设置权重失败';
  } finally {
    loading.setShare = false;
  }
}

async function handleSendReward() {
  if (!rewardAmount.value) {
    tip.value = '请输入充值金额';
    return;
  }
  loading.sendReward = true;
  tip.value = '';
  try {
    const amount = new BigNumber(rewardAmount.value).multipliedBy(new BigNumber("1000000000000000000")).toFixed(0);
    await sendReward(amount);
    tip.value = '充值分红提交成功';
    rewardAmount.value = '';
  } catch (e) {
    console.error(e);
    tip.value = '充值失败';
  } finally {
    loading.sendReward = false;
  }
}
</script>

<template>
  <div class="l-title">手续费分红</div>
  <div class="l-input mb16">
    <div class="input">
      <van-field v-model="address" placeholder="输入用户地址" />
    </div>
    <div class="btn" @click="queryWeight">
      <van-loading size="18" color="#e89c3a" v-if="loading.query" />
      <span v-else>查询</span>
    </div>
  </div>
  <div class="l-info mb10">
    <div class="left">分红权重</div>
    <div class="right">{{ shareInfo.share }}</div>
  </div>
  <div class="l-input mb16" style="margin-top: 12px">
    <div class="input">
      <van-field v-model="shareInput" placeholder="输入权重数量" />
    </div>
  </div>
  <div v-if="loading.setShare" class="l-btn">
    <van-loading size="22" type="circular" color="#FFF" />
  </div>
  <div v-else class="l-btn" @click="handleSetShare">设置权重</div>
  <div class="l-input mb16" style="margin-top: 20px">
    <div class="input">
      <van-field v-model="rewardAmount" placeholder="输入充值金额" />
    </div>
  </div>
  <div v-if="loading.sendReward" class="l-btn">
    <van-loading size="22" type="circular" color="#FFF" />
  </div>
  <div v-else class="l-btn" @click="handleSendReward">充值分红</div>
  <div v-if="tip" class="l-info mt16">
    <div class="left">提示</div>
    <div class="right">{{ tip }}</div>
  </div>
  <div style="height: 20px;"></div>
</template>

<style scoped>
@import "@/views/admin/manage.scss";
</style>
