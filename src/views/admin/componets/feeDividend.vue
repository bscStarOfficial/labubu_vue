<script setup>
import {ref, reactive, onMounted} from 'vue';
import BigNumber from "bignumber.js";
import {userInfo, setShare, sendReward} from "@/js/contracts/swapFeeDividend";
import {allowance, approve, balanceOf} from "@/js/contracts/erc20s";
import {getAddress} from "@/js/config";
import {getSelectedAddress} from "@/js/web3";

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
const rewardDecimals = new BigNumber("1000000000000000000");
const MAX_UINT256 = new BigNumber("115792089237316195423570985008687907853269984665640564039457584007913129639935");
const walletBalance = ref('0');

function formatValue(value) {
  if (value === null || value === undefined) return '0';
  if (typeof value === 'string') return value;
  if (value.toString) return value.toString();
  return String(value);
}

async function fetchWalletBalance() {
  const owner = getSelectedAddress();
  if (!owner) {
    walletBalance.value = '0';
    return;
  }
  try {
    const raw = await balanceOf('labubu', owner);
    const formatted = new BigNumber(raw?.toString?.() ?? raw ?? '0').dividedBy(rewardDecimals).toFixed(4, 1);
    walletBalance.value = formatted;
  } catch (e) {
    console.error(e);
    walletBalance.value = '0';
  }
}

onMounted(() => {
  fetchWalletBalance();
});

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
    const amount = new BigNumber(rewardAmount.value).multipliedBy(rewardDecimals).toFixed(0);
    const spender = await getAddress('swapFeeDividend');
    const approved = await allowance('labubu', spender);
    const approvedAmount = new BigNumber(approved?.toString?.() ?? approved ?? '0');
    if (approvedAmount.lt(amount)) {
      tip.value = '正在通过钱包授权 Labubu 给 swapFeeDividend';
      await approve('labubu', spender, MAX_UINT256.toFixed(0));
      tip.value = '授权完成，继续充值';
    }
    await sendReward(amount);
    tip.value = '充值分红提交成功';
    rewardAmount.value = '';
    await fetchWalletBalance();
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
  <div class="l-info mb16">
    <div class="left">当前钱包 Labubu 余额</div>
    <div class="right">{{ walletBalance }}</div>
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
