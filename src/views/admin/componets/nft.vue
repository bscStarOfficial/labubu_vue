<script setup>
import {onMounted, reactive, ref} from 'vue'
import {getMaxAmount, setMaxAmount} from "@/js/contracts/labubu";
import {formatEther} from "ethers";
import {getMaxDepositTokenId, getMaxTokenId} from "@/js/contracts/labubuNFT";

const loading = reactive([false, false]);
const maxTokenId = ref('0');
const expectMaxTokenId = ref('');
const maxDepositId = ref('');
const expectMaxDepositId = ref('');

onMounted(async () => {
  await init()
})

async function init() {
  maxTokenId.value = (await getMaxTokenId()).toString();
  maxDepositId.value = (await getMaxDepositTokenId()).toString();
}

async function doSetMaxTokenId() {
  if (loading[0]) return;
  loading[0] = true;
  try {
    await setMaxTokenId(expectMaxTokenId.value);
  } catch (e) {
    console.log(e)
  }
  loading[0] = false;
  expectMaxTokenId.value = ''
  await init()
}

async function doSetMaxDepositId() {
  if (loading[1]) return;
  loading[1] = true;
  try {
    await setMaxDepositId(expectMaxDepositId.value);
  } catch (e) {
    console.log(e)
  }
  loading[1] = false;
  expectMaxDepositId.value = ''
  await init()
}


</script>
<template>
  <div class="l-info mb10">
    <div class="left">最大可购买NFT编号</div>
    <div class="right">{{ maxTokenId }}</div>
  </div>
  <div class="l-input mb16" style="margin-top: 20px">
    <van-field v-model="expectMaxTokenId" placeholder="输入最大入金金额"/>
  </div>

  <div v-if="loading[0]" class="l-btn">
    <van-loading size="22" type="circular" color="#FFF"/>
  </div>
  <div v-else class="l-btn" @click="doSetMaxTokenId()">设置</div>
  <div style="height: 20px;"></div>

  <!--最大可入单NFT编号-->
  <div class="l-info mb10">
    <div class="left">最大可入单NFT编号</div>
    <div class="right">{{ maxDepositId }}</div>
  </div>
  <div class="l-input mb16" style="margin-top: 20px">
    <van-field v-model="expectMaxDepositId" placeholder="输入最大可入单NFT编号"/>
  </div>

  <div v-if="loading[1]" class="l-btn">
    <van-loading size="22" type="circular" color="#FFF"/>
  </div>
  <div v-else class="l-btn" @click="doSetMaxDepositId()">设置</div>
  <div style="height: 20px;"></div>
</template>
<style scoped>
@import "@/views/admin/manage.scss";
</style>
