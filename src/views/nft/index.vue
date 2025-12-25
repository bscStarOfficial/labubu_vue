<script setup>

// 钱包地址
import {onMounted, ref} from "vue";
import {showDialog} from "vant";
import {getNFTImage} from "@/js/config";

const walletAddress = ref('0x7a3f5...8b9c1');

// 当前NFT信息
const currentNFT = ref({
  id: '#0893',
  price: 2.5,
  pendingDividends: 0.856,
  receivedDividends: 3.214
});

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

// 获取收益
const claimEarnings = () => {
  claiming.value = true;

  // 模拟API请求
  setTimeout(() => {
    const earnings = currentNFT.value.pendingDividends;
    currentNFT.value.receivedDividends += earnings;
    currentNFT.value.pendingDividends = 0;

    showDialog({
      title: '收益领取成功',
      confirmButtonText: '确定',
      allowHtml: true
    });

    claiming.value = false;


  }, 1000);
};

// 模拟加载数据
onMounted(() => {
  // 这里可以添加API调用
  console.log('暗色科技风NFT平台已加载');
});

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
            <div class="wallet-address">{{ walletAddress }}</div>
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
                <div class="info-value">{{ currentNFT.id }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">NFT价格</div>
                <div class="info-value price"> 0.6 BNB</div>
              </div>
              <div class="info-item">
                <div class="info-label">待分红金额</div>
                <div class="info-value pending">0</div>
              </div>
              <div class="info-item">
                <div class="info-label">已分红金额</div>
                <div class="info-value received">0</div>
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
