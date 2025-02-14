<template>
    <div class="w-full h-full flex flex-col p-4 gap-x-2 mt-[55px]">
        <div class="w-[1328px] flex flex-row space-x-[34px]">
            <div v-for="(item, index) in options" :key="index" 
                :class="['flex-1 h-[558px] bg-white rounded-md flex flex-col items-center shadow-md', selectedScription.planId == item.planId? 'border border-main-color' : '']"
                @click="selectScription(item)">
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
        <div class="flex flex-row mt-[35px] w-[1328px] h-[180px] bg-white justify-between items-center rounded-lg shadow-md">
            <div class="flex flex-row items-center ml-[73px] space-x-2">
                <p class="text-[24px]">会员优惠券</p>
                <input type="text" placeholder="请输入会员优惠券" class="bg-[#DADADA] w-[340px] h-[50px] rounded-md px-4"
                    v-model="membershipCode">
                <div :class="['flex-1 w-[157px] h-[50px] bg-main-color flex justify-center items-center rounded-lg cursor-pointer', isDisable? 'cursor-not-allowed bg-[#A0A0A0]': '']"
                     @click="activeMemberShipByCode">确认兑换</div>
            </div>
            <div class="flex flex-row mr-8" v-if="!selectedScription.isFree">
                <Payment 
                    :planId="selectedScription.planId"
                    :payMethod="payMethod"/>
                <div class="flex flex-col ml-[39px]">
                    <p class="text-[20px] mb-2">支付金额: {{ selectedScription.price }}</p>
                    <div class="flex flex-row">
                        <span class="w-[36px] h-[32px] mb-2
                            bg-[url('@/assets/images/Swifaigo/wechat.png')]"/>
                        <p class="text-[16px]">微信支付</p>
                    </div>
                    <p>支付即视为您已同意《会员协议》</p>
                </div>
            </div>
        </div>
        <el-dialog v-model="showSubscriptionResult" 
            :show-close="false"
            :before-close="() => { showSubscriptionResult = false }">
			<div class="w-full h-full flex flex-col items-center">
                <div class="flex flex-row mt-[80px]">
                    <div class="w-[78px] h-[70px] bg-[url('@/assets/images/Swifaigo/logo-vip-big.png')] bg-cover"/>
                    <p class="text-[36px]">购买/兑换成功</p>
                </div>
                <p class="mt-[140px] w-[250px] h-[56px] bg-main-color rounded-[80px] flex justify-center items-center text-[32px] text-white cursor-pointer" @click="() => { showSubscriptionResult = false }">立即体验</p>
            </div>
		</el-dialog>
    </div>
</template>

<script lang="ts">
import { onMounted, ref, SetupContext, computed } from "vue"
import Payment from '../Payment/index.vue' 
import { Account } from '@/store/index'
import { ElMessage } from 'element-plus';

interface Subscription{
    title: string,
    isFree: boolean,
    planId: string,
    name: string,
    description: string,
    price: string,
    feature: []
}

export default {
    name: "MemberShip",
    props: {},

    emits: [],
    components: { Payment },

    setup(props: any, context: SetupContext) {
        const subscriptions = ref([] as Subscription[])
        const selectedScription = ref( {
            title: '', isFree: false, price: '', feature: [] as any, planId: ''
        } )

        let payMethod = ref('wechat')

        let membershipCode = ref('')

        let showSubscriptionResult = ref(false)

        const isDisable = computed(() => membershipCode.value.length === 0 )

        // TODO: 这个地方和后台服务对齐
        let options = ref([
            {   
                title: '普通会员', isFree: true,  price: '免费',     
                feature: [
                    { name: '拍摄功能', message: '无限制' },
                    { name: '抠图',     message: '3次/月' },
                    { name: '美化',     message: '3次/月' },
                    { name: 'AI场景图', message: '3次/月' },
                    { name: '存储',     message: '-' }
                ],
                planId: ''
            },
            { 
                title: '黄金会员', isFree: false, price: '¥39.99/月',
                feature: [
                    { name: '拍摄功能', message: '无限制' },
                    { name: '抠图',     message: '100次/月' },
                    { name: '美化',     message: '100次/月' },
                    { name: 'AI场景图', message: '100次/月' },
                    { name: '存储',     message: '150G' }
                ],
                planId: ''
            },
            { 
                title: '黄金会员', isFree: false, price: '¥393.99/月',
                feature: [
                    { name: '拍摄功能', message: '无限制' },
                    { name: '抠图',     message: '100次/月' },
                    { name: '美化',     message: '100次/月' },
                    { name: 'AI场景图', message: '100次/月' },
                    { name: '存储',     message: '150G' }
                ],
                planId: ''
            }
        ])

        onMounted(async () => {
            subscriptions.value = await Account.methods.getSubscriptions()
            // planId: '6774ea870c74aa258e39e915', name: '按半年订阅', description: '订阅半年，价格为2元人民币', price: 2

            options.value[1].price = `¥${subscriptions.value[0].price}/月`
            options.value[1].planId = subscriptions.value[0].planId

            options.value[2].price = `¥${subscriptions.value[1].price}/年`
            options.value[2].planId = subscriptions.value[1].planId

            selectedScription.value = options.value[1]
            console.error('##############', selectedScription.value)
        })
        
        function upgradeSubscription(){

        }

        function selectScription(item: Subscription){
            selectedScription.value = item
        }

        async function activeMemberShipByCode(){ 
            if(!isDisable.value){
                const isSuccess = await Account.methods.activeMembershipByCode(membershipCode.value)
                if(isSuccess){
                    showSubscriptionResult.value = true
                }else{
                    ElMessage({
                        message: '兑换码无效',
                        type: 'error'
                    });
                    membershipCode.value = ''
                }
                
            }
        }

        return { isDisable, showSubscriptionResult, activeMemberShipByCode, membershipCode, payMethod, options, upgradeSubscription, subscriptions, selectScription, selectedScription }
    },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";

.el-dialog{
    width: 652px !important;
    height: 388px !important;
    padding: 0 !important;
    background: #FFF !important;
}

.el-dialog__body{
    width: 100% !important;
    height: 100% !important
}

.el-dialog__header{
    display: none !important;
}
</style>
