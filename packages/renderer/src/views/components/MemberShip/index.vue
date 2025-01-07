<template>
  <div class="w-[1270px] h-[770px] flex flex-col p-1">
    <div class="header w-[95%] h-[90px] object-cover flex flex-col text-white p-3">
        <p class="text-[24px]">账户升级</p>
        <p class="text-[22px]">当前版本：免费版</p>
    </div>
    <div class="w-[98%] h-full flex flex-row mt-4">
        <div class="flex-1 bg-[#F5F5F5] rounded-2xl p-3">
            <div class="flex flex-row justify-center items-center mt-5 ">
                <span class="vip-0"/>
                <span class="main-logo"/>
            </div>
            <p class="text-[24px] mt-5 font-black">子账户权限</p>
            <p class="text-[20px] mt-1">可根据团队人员添加多个子账户权限，高效完成协作工作</p>

            <p class="text-[24px] mt-5 font-black">扩充存储容量</p>
            <p class="text-[20px]">轻松点击扩充存储容量、照片、资料随心存，告别空间忧虑</p>

            <p class="text-[24px] mt-5 font-black">新增目录</p>
            <p class="text-[20px] mt-1">一键新增目录，精准定位，畅享便捷制图</p>

            <p class="text-[24px] mt-5 font-black">AI场景图</p>
            <p class="text-[20px] mt-1">智能开启 AI 背景移除，复杂背景瞬间消散，创意画面随心打造。</p>
        </div>
        <div class="flex-1 flex flex-col ml-5">
            <div class="flex flex-row space-x-2">
                <div class="flex flex-col flex-1 h-[159px] bg-[#F3F3F3] rounded-xl justify-center items-center">
                    <p class="text-[24px]">会员券</p> 
                    <p class="text-[32px]">¥129.99</p>   
                </div>
                <div class="flex flex-col flex-1 h-[159px] bg-[#F3F3F3] rounded-xl justify-center items-center">
                    <p class="text-[24px]">连续包月</p> 
                    <p class="text-[32px]">¥299.99</p>   
                </div>
                <div class="flex flex-col flex-1 h-[159px] bg-[#F3F3F3] rounded-xl justify-center items-center">
                    <p class="text-[24px]">包年</p> 
                    <p class="text-[32px]">¥399.99</p>   
                </div>
            </div>
            <div class="flex flex-col mt-4">
                <p class="text-[24px] mt-2">拍摄功能</p>
                <p class="text-[24px] mt-2">子账户</p>
                <p class="text-[24px] mt-2">存储</p>
                <p class="text-[24px] mt-2">美化</p>
                <p class="text-[24px] mt-2">AI 场景图</p>
                <div class="flex flex-row items-center mt-5">
                    <p class="text-[20px]">促销代码</p>
                    <input type="text" class="mr-2 bg-gray-100 border-0 p-2 ml-4 w-[330px] h-[50px] rounded-md focus:ring-0" placeholder="请输入促销代码" />
                    <div class="flex flex-1 h-[50px] justify-center items-center bg-main-color rounded-xl text-white">
                        确认兑换
                    </div>
                </div>
            </div>
            <div class="bg-[#F5F5F5] mt-4 flex-1 rounded-xl flex flex-row items-center p-4">
                <Payment
                :value="selectedScription"/>
                <div class="flex-1 h-full bg-blue-200 ml-2 flex flex-col p-2">
                    <p class="text-[25px]">支付金额 ¥0.01 </p>
                    <div class="flex flex-row items-center">
                        <span class="wechat-pay mr-2"/>
                        <p>微信支付</p>
                    </div>
                    <p>支付即视为您已同意《会员协议》</p>
                    <p>付款成功后，可在订单页申请开具发票</p>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import { SetupContext, onMounted, ref } from "vue"
import Payment from '../UserZone/Payment/index.vue'
import { Account } from '@/store/index'

interface Subscription{
    planId: string,
    name: string,
    description: string,
    price: number
}

export default {
  name: "MemberShip",
  props: {},

  emits: [],
  components: { Payment },

  setup(props: any, context: SetupContext) {
    const subscriptions = ref([] as Subscription[])
    const selectedScription = ref( {} as Subscription)
    onMounted(async () => {
        subscriptions.value = await Account.methods.getSubscriptions()
        selectedScription.value = subscriptions.value[0]
        console.log('@@@@@@@@@@@@@', selectedScription.value)
    })
    return { selectedScription }
  },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
.header{
    background: url('@/assets/images/Swifaigo/membership_header.png');
}
.vip-0{
    background: url('@/assets/images/Swifaigo/VIP_0.png');
    width: 38px;
    height: 32px;
    margin-right: 5px;
}
.vip-1{
    background: url('@/assets/images/Swifaigo/VIP_1.png');
    width: 52px;
    height: 47px;
}
.main-logo{
    background: url('@/assets/images/Swifaigo/main-logo.png');
    width: 232px;
    height: 53px;
}
.wechat-pay{
    background: url('@/assets/images/Swifaigo/pay-wechat.png');
    width: 36px;
    height: 32px;
}
</style>
