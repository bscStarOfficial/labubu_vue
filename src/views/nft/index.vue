<script setup>

// 钱包地址
import {onMounted, ref} from "vue";
import {showDialog} from "vant";
import {getNFTImage} from "@/js/config";
import {useLabubuNFTStore} from "@/stores/labubuNFT";
import {getSelectedAddress} from "@/js/web3";
import {replaceMiddleWithAsterisks, toFixed} from "@/js/utils";
import {claim as claimLabubuNFT} from "@/js/contracts/labubuNFT";
import {claim as claimFeeDividend} from "@/js/contracts/swapFeeDividend";

const STATE_CALL_IDS = [0, 1, 2, 3, 4, 5, 6];
const store = useLabubuNFTStore();
onMounted(async () => {
  await store.setState(STATE_CALL_IDS);
})

// NFT合集列表
const nftList = ref([
  {id: '#0-99', name: '🚀LABUBU'},
  {id: '#100-199', name: '🦸LABUBU'},
  {id: '#200-299', name: '🎈LABUBU'},
  {id: '#300-399', name: '☁️LABUBU'},
  {id: '#400-499', name: '🪂LABUBU'},
  {id: '#500-599', name: '🧑‍🚀LABUBU'},
  {id: '#600-699', name: '🧙LABUBU'},
  {id: '#700-799', name: '🧚‍♀️LABUBU'},
  {id: '#800-899', name: '🐬LABUBU'},
  {id: '#900-999', name: '👼LABUBU'}
]);

// 状态
const claiming = ref(false);
const feeClaiming = ref(false);

// 获取收益
const claimEarnings = async () => {
  claiming.value = true;

  try {
    await claimLabubuNFT();
    await showDialog({
      title: '收益领取成功',
      confirmButtonText: '确定',
      allowHtml: true
    });
    await store.setState(STATE_CALL_IDS);
  } catch (error) {
    console.log(error);
  }
  claiming.value = false;
};

const claimFeeDividendEarnings = async () => {
  feeClaiming.value = true;
  try {
    await claimFeeDividend();
    await showDialog({
      title: '手续费分红提取成功',
      confirmButtonText: '确定',
      allowHtml: true
    });
    await store.setState(STATE_CALL_IDS);
  } catch (error) {
    console.log(error);
  }
  feeClaiming.value = false;
};


</script>
<template>
  <div class="main">
    <!-- 网格背景 -->
    <div class="grid-bg"></div>

    <!-- 扫描线效果 -->
    <div class="scan-line"></div>

    <!-- 科技感背景元素 -->
    <div class="tech-bg-element tech-bg-1"></div>
    <div class="tech-bg-element tech-bg-2"></div>

    <div id="app">
      <div class="app-container">
        <!-- 头部 -->
        <header class="header">
          <div class="header-top">
            <div class="logo">
              <div class="logo-icon">
                <img src="@/assets/logo/labubu.png" alt="" width="32" height="32"/>
              </div>
              <!--              <span>SKY LAB</span>-->
            </div>
            <div class="wallet-address">{{ replaceMiddleWithAsterisks(getSelectedAddress()) }}</div>
          </div>
          <div class="title-container">
            <h1 class="title">SKY LABUBU</h1>
          </div>
        </header>

        <!-- NFT信息 -->
        <main>
          <section class="nft-info-card">
            <div class="info-title">当前NFT信息</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">NFT编号</div>
                <div class="info-value">{{ store.fistTokenId === 999999 ? "未获取": store.fistTokenId }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">NFT价格</div>
                <div class="info-value price"> {{ Number(store.nftPrice) }} BNB</div>
              </div>
              <div class="info-item">
                <div class="info-label">待分红金额</div>
                <div class="info-value pending">{{ store.availableReward }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">已分红金额</div>
                <div class="info-value received">{{ store.payee.released }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">入单总收益额度</div>
                <div class="info-value pending">{{ toFixed(store.recoupment.quota, 2) }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">剩余额度</div>
                <div class="info-value received">{{ store.recoupmentLeftQuota }}</div>
              </div>
            </div>
            <van-button
              class="earnings-btn"
              block
              @click="claimEarnings"
              :loading="claiming"
            >
              获取收益
            </van-button>
          </section>

          <section
              v-if="Number(store.swapFeeDividend.share) > 0 || Number(store.swapFeeDividend.pendingReward) > 0"
              class="nft-info-card">
            <div class="info-title">手续费分红</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">分红权重</div>
                <div class="info-value pending">{{ store.swapFeeDividend.share }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">待获取分红</div>
                <div class="info-value received">{{ store.swapFeeDividend.pendingReward }}</div>
              </div>
            </div>
            <van-button
                class="earnings-btn"
                block
                @click="claimFeeDividendEarnings"
                :loading="feeClaiming"
            >
              获取收益
            </van-button>
          </section>

          <!-- NFT合集 -->
          <section class="nft-collection">
            <div class="collection-title">NFT合集 ({{ nftList.length }})</div>
            <div class="nft-list">
              <div
                class="nft-item"
                v-for="(nft,index) in nftList"
                :key="nft.id"
              >
                <div class="nft-image">
                  <img :src="getNFTImage(index + 1)" alt="" width="100%">
                </div>
                <div class="nft-details">
                  <div class="nft-id">ID: {{ nft.id }}</div>
                  <div class="nft-name">{{ nft.name }}</div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <div class="footer">
          SKY LABUBU NFT 平台 © 2025
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/views/nft/index.scss";
</style>
