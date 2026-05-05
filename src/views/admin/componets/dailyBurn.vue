<script setup>
import {onMounted, reactive, ref} from 'vue'
import {dailyBurnRate, setDailBurnRate} from "@/js/contracts/labubu";

const loading = reactive([false]);
const dailyBurnRates = ref([0, 0, 0])
const dailyBurnRatesSet = ref(['', '', ''])

onMounted(async () => {
  await init()
})

async function init() {
  let res = await Promise.all([
    dailyBurnRate(0),
    dailyBurnRate(1),
    dailyBurnRate(2),
  ]);
  dailyBurnRates.value = [res[0], res[1], res[2]];
}

async function doSetDailBurnRate() {
  if (loading[0]) return;
  loading[0] = true;
  try {
    await setDailBurnRate(dailyBurnRatesSet.value);
  } catch (e) {
    console.log(e)
  }
  loading[0] = false;
  await init()
}


</script>
<template>
  <div class="l-info mb10">
    <div class="left">销毁比例</div>
    <div class="right">{{ dailyBurnRates[0] / 100 }}%</div>
  </div>
  <div class="l-info mb10">
    <div class="left">项目方比例</div>
    <div class="right">{{ dailyBurnRates[1] / 100 }}%</div>
  </div>
  <div class="l-info mb10">
    <div class="left">分红比例</div>
    <div class="right">{{ dailyBurnRates[2] / 100 }}%</div>
  </div>

  <div class="l-input mb16" style="margin-top: 20px">
    <van-field v-model="dailyBurnRatesSet[0]" placeholder="输入销毁比例(1%输入100)"/>
  </div>
  <div class="l-input mb16" style="margin-top: 20px">
    <van-field v-model="dailyBurnRatesSet[1]" placeholder="输入项目方比例(0.5%输入50)"/>
  </div>
  <div class="l-input mb16" style="margin-top: 20px">
    <van-field v-model="dailyBurnRatesSet[2]" placeholder="输入Lp分红比例(3个比例加一起必须小于等于300)"/>
  </div>
  <div v-if="loading[0]" class="l-btn">
    <van-loading size="22" type="circular" color="#FFF"/>
  </div>
  <div v-else class="l-btn" @click="doSetDailBurnRate()">设置比例</div>
  <div style="height: 20px;"></div>
</template>
<style scoped>
@import "@/views/admin/manage.scss";
</style>
