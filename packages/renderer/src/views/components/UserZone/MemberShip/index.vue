<template>
  <div class="border-2 border-blue-600 w-full h-full flex flex-row p-4 gap-x-2">
    <div class="flex-1 border-2 border-red-300">
        info
    </div>
    <div class="flex-1 bg-white border-2 border-red-300 rounded-lg flex flex-col p-5">
        <div class="border-2 border-black w-auto h-1/2 rounded">
            <div class="flex flex-row justify-center items-center">
                <span class="icon-camera text-indigo-400"/>
                <p>Free</p>
            </div>
            <p class="text-xl">$0/mo</p>
            <!-- <el-button>当前计划</el-button> -->
        </div>
        <div class="border-2 border-black w-1/3">
            bot
        </div>
    </div>
    <div class="flex-1 bg-white border-2 border-red-300 rounded-lg flex flex-col p-2">
        <div class="w-auto h-3/5 rounded bg-beige p-4 flex flex-col justify-between">
            <div class="flex flex-row justify-center items-center">
                <span class="icon-crown w-7 h-7 border rounded-sm border-blue-300 flex flex-row justify-center items-center"/>
            </div>
            <div class="flex flex-row border border-grey-400 rounded-sm"
                v-loading="subscriptions.length == 0">
                <div class="flex-1 h-14 flex flex-col justify-center items-center"
                    v-for="(item, index) in subscriptions" :key="index" @click="selectScription(item)"
                    :style="{'background-color': selectedScription.planId == item.planId? '#FF0000' : '#00FF00'}">
                    <p class="text-xs">{{ item.name }}</p>
                    <p class="text-xs">{{ item.price}}</p>
                </div>
            </div>
            <div class="w-full h-10 bg-orange-400 rounded-sm flex flex-row justify-center items-center" @click="showMessageBox">升级</div>
        </div>
        <div class="border-2 border-black w-1/3">
            bot
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, ref, SetupContext } from "vue"
import { ElMessageBox } from 'element-plus'
import { h } from 'vue'
import Payment from '../Payment/index.vue' 
import { Account, LoginMethod } from '@/store/index'

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
    components: {},

    setup(props: any, context: SetupContext) {
        const subscriptions = ref([] as Subscription[])
        const selectedScription = ref( {} as Subscription)
        onMounted(async () => {
            subscriptions.value = await Account.methods.getSubscriptions()
            selectedScription.value = subscriptions.value[0]
        })
        
        function upgradeSubscription(){

        }

        function selectScription(item: Subscription){
            selectedScription.value = item
        }

        const showMessageBox = () => {
            ElMessageBox({
                title: '自定义内容',
                message: h(Payment, { value: selectedScription }),
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            })
            .then(() => {
                console.log('用户点击了确定');
            })
            .catch(() => {
                console.log('用户取消操作');
            });
        }

        return { upgradeSubscription, showMessageBox, subscriptions, selectScription, selectedScription }
    },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
</style>
