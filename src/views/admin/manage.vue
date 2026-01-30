<script setup>
import {onMounted, ref} from 'vue'
import dailyBurn from "./componets/dailyBurn.vue";
import deposit from "./componets/deposit.vue";

const tab = ref(0)
onMounted(async () => {
})

</script>
<template>
  <div class="liquidity">
    <van-nav-bar title="LABUBU管理后台" class="l-navbar"/>
    <div class="l-btns">
      <div class="tabs">
        <div :class="tab == 0 ? 'tab-a' : 'tab'" @click="tab = 0">每日通缩</div>
        <div :class="tab == 1 ? 'tab-a' : 'tab'" @click="tab = 1">白名单</div>
      </div>
    </div>
    <dailyBurn v-if="tab == 0"></dailyBurn>
    <deposit v-if="tab == 1"></deposit>
  </div>
</template>
<style scoped>
@import "@/views/admin/manage.scss";
</style>
