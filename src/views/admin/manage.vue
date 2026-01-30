<script setup>
import {onMounted, ref} from 'vue'
import dailyBurn from "./componets/dailyBurn.vue";
import role from "./componets/role.vue";
import maxAmount from "./componets/maxAmount.vue";

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
        <div :class="tab == 2 ? 'tab-a' : 'tab'" @click="tab = 2">入单金额</div>
      </div>
    </div>
    <dailyBurn v-if="tab == 0"></dailyBurn>
    <role v-if="tab == 1"></role>
    <maxAmount v-if="tab == 2"></maxAmount>
  </div>
</template>
<style scoped>
@import "@/views/admin/manage.scss";
</style>
