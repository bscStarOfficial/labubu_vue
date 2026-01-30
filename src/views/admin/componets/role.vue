<script setup>
import {onMounted, reactive, ref} from 'vue'
import {dailyBurnRate, setDailBurnRate} from "@/js/contracts/labubu";
import {keccak256, toUtf8Bytes} from "ethers";
import {grantRole, hasRole, revokeRole} from "@/js/contracts/manage";

const loading = reactive([false, false]);
const user = ref('0x93174A96E8A4823C5aBBB74900D5bACBA2e774b0');
const checked = ref('');

onMounted(async () => {

})

async function search() {
  let role = keccak256(toUtf8Bytes('Deposit_Whitelist'));
  if (await hasRole(role, user.value)) {
    checked.value = '1'
  } else {
    checked.value = '0'
  }
  console.log(checked.value);
}

async function doRevokeRole() {
  let role = keccak256(toUtf8Bytes('Deposit_Whitelist'));
  if (loading[0]) return;
  loading[0] = true;
  try {
    await revokeRole(role, user.value);
  } catch (e) {
    console.log(e)
  }
  loading[0] = false;
  await search()
}

async function doGrantRole() {
  let role = keccak256(toUtf8Bytes('Deposit_Whitelist'));
  if (loading[1]) return;
  loading[1] = true;
  try {
    await grantRole(role, user.value);
  } catch (e) {
    console.log(e)
  }
  loading[1] = false;
  await search()
}

</script>
<template>
  <div class="l-title">投入白名单</div>
  <div class="l-input mb28">
    <div class="input">
      <van-field v-model="user" placeholder="输入地址"/>
    </div>
    <div class="btn" @click="search()">查询</div>
  </div>
  <div class="l-info mb10">
    <van-radio-group v-model="checked" direction="horizontal">
      <van-radio name="1">已开通</van-radio>
      <van-radio name="0">未开通</van-radio>
    </van-radio-group>
  </div>

  <template v-if="checked === '0'">
    <div v-if="loading[1]" class="l-btn">
      <van-loading size="22" type="circular" color="#FFF"/>
    </div>
    <div v-else class="l-btn" @click="doGrantRole()">开通白名单</div>
  </template>

  <template v-if="checked === '1'">
    <div v-if="loading[0]" class="l-btn">
      <van-loading size="22" type="circular" color="#FFF"/>
    </div>
    <div v-else class="l-btn" @click="doRevokeRole()">关闭白名单</div>
  </template>
</template>
<style scoped>
@import "@/views/admin/manage.scss";
</style>
