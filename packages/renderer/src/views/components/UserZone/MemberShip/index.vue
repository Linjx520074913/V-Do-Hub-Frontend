<template>
    <div class="w-full h-full flex flex-col p-4 gap-x-2">
        <div class="flex flex-row space-x-[34px]">
            <div v-for="(item, index) in options" :key="index" 
                class="w-[420px] h-[558px] bg-white rounded-md flex flex-col items-center shadow-md">
                <div class="flex flex-row items-center justify-center mt-[37px] h-[79px]">
                    <span v-show="!item.isFree" class="bg-cover w-[95px] h-[79px] bg-[url('@/assets/images/Swifaigo/logo-vip-big.png')]"/>
                    <p class="font-bold text-[32px] text-black">{{ item.title }}</p>
                </div>
                
                <p class="text-[30px] mt-3">{{ item.price }}</p>
                <div v-if="item.isFree" class="mt-3 mb-[34px] w-[270px] h-[54px] bg-[#F3F3F3] flex items-center justify-center rounded-xl text-black">
                    立即使用
                </div>
                <div v-else class="mt-3 mb-[34px] w-[270px] h-[54px] bg-main-color flex items-center justify-center rounded-xl text-white">
                    立即升级
                </div>
                <div v-for="(feature, id) in item.feature" class="flex flex-row w-full space-y-[16px]">
                    <p class="flex-1 flex justify-center items-center text-[20px] font-bold">{{  feature.name }}</p>
                    <p class="flex-1 flex justify-center items-center text-[20px]">{{  feature.message }}</p>
                </div>
            </div>
        </div>
        <div class="flex flex-row mt-[35px] w-full h-[180px] bg-white justify-between items-center rounded-lg shadow-md">
            <div class="flex flex-row items-center ml-[73px] space-x-2">
                <p>会员优惠券</p>
                <input type="text" placeholder="请输入会员优惠券" class="bg-[#DADADA] w-[340px] h-[50px] rounded-md">
                <div class="w-[157px] h-[50px] bg-main-color flex justify-center items-center rounded-lg">确认兑换</div>
            </div>
            <div class="flex flex-row mr-8">
                <!-- <Payment
                :value="selectedScription"/> -->
                <div class="flex flex-col ml-[39px]">
                    <p class="text-[20px] mb-2">支付金额: 33.99</p>
                    <div class="flex flex-row">
                        <span class="w-[36px] h-[32px] mb-2
                            bg-[url('@/assets/images/Swifaigo/alipay.png')]"/>
                        <span class="w-[36px] h-[32px] mb-2
                            bg-[url('@/assets/images/Swifaigo/wechat.png')]"/>
                        <p class="text-[16px]">支付宝支付/微信支付</p>
                    </div>
                    <p>支付即视为您已同意《会员协议》</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { onMounted, ref, SetupContext } from "vue"
import Payment from '../Payment/index.vue' 
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
    components: {  },

    setup(props: any, context: SetupContext) {
        const subscriptions = ref([] as Subscription[])
        const selectedScription = ref( {} as Subscription)

        const options = ref([
            {   
                title: '普通会员', isFree: true,  price: '免费',     
                feature: [
                    { name: '拍摄功能', message: 'OK' },
                    { name: '抠图',     message: '3次/月' },
                    { name: '美化',     message: '3次/月' },
                    { name: 'AI场景图', message: '3次/月' },
                    { name: '存储',     message: '-' }
                ]
            },
            { 
                title: '黄金会员', isFree: false, price: '¥39.99/月',
                feature: [
                    { name: '拍摄功能', message: 'OK' },
                    { name: '抠图',     message: '100次/月' },
                    { name: '美化',     message: '100次/月' },
                    { name: 'AI场景图', message: '100次/月' },
                    { name: '存储',     message: '150G' }
                ]  
            },
            { 
                title: '黄金会员', isFree: false, price: '¥393.99/月',
                feature: [
                    { name: '拍摄功能', message: 'OK' },
                    { name: '抠图',     message: '100次/月' },
                    { name: '美化',     message: '100次/月' },
                    { name: 'AI场景图', message: '100次/月' },
                    { name: '存储',     message: '150G' }
                ]
            }
        ])

        onMounted(async () => {
            subscriptions.value = await Account.methods.getSubscriptions()
            selectedScription.value = subscriptions.value[0]
        })
        
        function upgradeSubscription(){

        }

        function selectScription(item: Subscription){
            selectedScription.value = item
        }

        return { options, upgradeSubscription, subscriptions, selectScription, selectedScription }
    },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
</style>
