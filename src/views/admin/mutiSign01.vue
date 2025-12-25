<script setup>
import {onMounted, reactive, ref} from 'vue';
import {useMultiSignStore} from "@/stores/mutiSign01";
import {submitTransaction, discardTransaction, confirmTransaction, executeTransaction} from "@/js/contracts/multiSign";
import {replaceMiddleWithAsterisks2} from "@/js/utils"
import {getSelectedAddress} from "@/js/web3";

const multiSigStore = useMultiSignStore();
const self = ref("")
onMounted(async () => {
  self.value = getSelectedAddress().toLowerCase();
  await multiSigStore.setState()
})
const loading = ref(false);
const loading2 = ref(false);

const address = ref("");
const amount = ref("");


const proposalType = ref('');
const show = reactive({
  proposal: false
})

async function showProposal(type) {
  proposalType.value = type;
  show.proposal = true;
}

async function doSubmitTransaction() {
  if (loading.value) return;
  loading.value = true;
  try {
    let destinationName, type;
    if (proposalType.value == 'addOwner' || proposalType.value == 'removeOwner') {
      destinationName = 'multiSign01';
      type = proposalType.value;
    } else if (proposalType.value == 'usdc' || proposalType.value == 'usdt') {
      destinationName = proposalType.value;
      type = 'transfer';
    } else if (proposalType.value == 'bnb') {
      destinationName = '';
      type = 'send';
    }
    await submitTransaction('multiSign01', destinationName, type, address.value, amount.value);
  } catch (e) {
    console.log(e)
  }
  loading.value = false;
  show.proposal = false;
  address.value = "";
  amount.value = "";
  await multiSigStore.setState()
}

async function doDiscardTransaction(id) {
  if (loading2.value) return;
  loading2.value = true;
  try {
    await discardTransaction('multiSign01', id);
  } catch (e) {
    console.log(e)
  }
  loading2.value = false;
  await multiSigStore.setState()
}

async function doConfirmTransaction(id) {
  if (loading2.value) return;
  loading2.value = true;
  try {
    await confirmTransaction('multiSign01', id);
  } catch (e) {
    console.log(e)
  }
  loading2.value = false;
  await multiSigStore.setState()
}

async function doExecuteTransaction(id) {
  if (loading2.value) return;
  loading2.value = true;
  try {
    await executeTransaction('multiSign01', id);
  } catch (e) {
    console.log(e)
  }
  loading2.value = false;
  await multiSigStore.setState()
}

</script>
<template>
  <!--  <div class="multiSign" v-if="multiSigStore.isOwner || self == '0xe46115B3cFd15eEF5BdDF88480EC2F095E5CE57d'.toLowerCase()">-->
  <div class="multiSign">
    <van-nav-bar class="Navbar" title="LABUBU 多签" :border="false"/>
    <div class="content">
      <div class="balance">
        <div class="tip-l">
          <img src="@/assets/tokens/usdt.png" alt="">
          <div>USDT余额</div>
        </div>
        <div class="tip-r">{{ multiSigStore.usdtBalance }}</div>
      </div>
      <div class="balance">
        <div class="tip-l">
          <img src="@/assets/tokens/usdc.png" alt="">
          <div>USDC余额</div>
        </div>
        <div class="tip-r">{{ multiSigStore.usdcBalance }}</div>
      </div>
      <div class="balance">
        <div class="tip-l">
          <img src="@/assets/tokens/bnb.png" alt="">
          <div>BNB余额</div>
        </div>
        <div class="tip-r">{{ multiSigStore.bnbBalance }}</div>
      </div>

      <div class="operate-title">操作记录</div>
      <div class="table">
        <div class="name">
          <div>地址</div>
          <div>行为</div>
          <div>操作</div>
        </div>
        <div class="row" v-for="(item, index) in multiSigStore.transactions" :key="index">
          <div class="address" :class="{ textG: item.status == '0', textR: item.status == '-1'  }">
            {{ replaceMiddleWithAsterisks2(item.address) }}
          </div>
          <div class="money" :class="{ textG: item.status == '0', textR: item.status == '-1' }">{{ item.amount }}</div>
          <div class="status">
            <template v-if="item.executed">
              <div class="textW">已执行</div>
            </template>
            <template v-else-if="item.submitter.toLowerCase() == '0x0000000000000000000000000000000000000000'">
              <div class="textW">已废弃</div>
            </template>
            <!--没有执行、投票人数不够、个人没同意，点同意  textR textG-->
            <template v-else>
              <div v-if="!item.executed && !item.confirms && !item.isAccountConfirms" class="textG" @click="doConfirmTransaction(item.id)">同意</div>
              <div v-if="!item.executed && !item.confirms && item.isAccountConfirms">已同意</div>
              <div v-if="!item.executed && item.confirms" class="textG" @click="doExecuteTransaction(item.id)">执行</div>
              <div v-if="!item.executed && item.submitter.toLowerCase() == self" @click="doDiscardTransaction(item.id)" class="textR">废弃</div>
            </template>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="btn" @click="showProposal('usdt')">USDT提案</div>
        <div class="btn" @click="showProposal('usdc')">USDC提案</div>
        <div class="btn" @click="showProposal('bnb')">BNB提案</div>
      </div>
      <div class="bottom" style="margin-top: 10px;">
        <!--        <div class="btn" @click="showProposal('btnBnb')">LP提案</div>-->
        <div class="btn" @click="showProposal('addOwner')">加员提案</div>
        <div class="btn" @click="showProposal('removeOwner')">减员提案</div>
      </div>
      <van-popup v-model:show="show.proposal" position="bottom" :style="{ width: '100%', height: '60%' }">
        <div class="title">
          <div v-if="proposalType == 'btn'">btn转账</div>
          <div v-if="proposalType == 'bnb'">bnb转账</div>
          <div v-if="proposalType == 'usdt'">usdt转账</div>
          <!--          <div v-if="proposalType == 'btnBnb'">LP转账</div>-->
          <div v-if="proposalType == 'addOwner'">加员提案</div>
          <div v-if="proposalType == 'removeOwner'">裁员提案</div>
        </div>
        <div class="input">
          <van-field placeholder="请输入地址" v-model="address"/>
        </div>
        <div class="input" v-if="proposalType == 'usdt' || proposalType == 'usdc' || proposalType == 'bnb'">
          <van-field placeholder="请输入转账数量" v-model="amount"/>
        </div>
        <div class='button' style="border-radius: 10px;" @click="doSubmitTransaction()">
          <p v-if="!loading">确定</P>
          <p v-else>
            <van-loading type="circular" color="#232324" size="24"/>
          </p>
        </div>
        <div class='buttonN' @click="show.proposal = false">
          <p>取消</P>
        </div>
      </van-popup>
    </div>
  </div>
</template>
<style scoped>
@import "@/views/admin/multiSign.css";
</style>
