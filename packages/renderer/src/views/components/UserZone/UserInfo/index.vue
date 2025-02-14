<template>
    <div class="w-full h-full flex flex-col mt-[23px]">
        <div class="flex flex-row">
            <p class="text-[24px]">手机号码</p>
            <p class="text-main-color text-[24px]">*</p>
        </div>
        <input class="h-[42px] text-[22px] bg-transparent" v-model="Account.data.curUser.phone"/>
        <p class="text-[24px] mt-[60px]">公司名称</p>
        <input class="h-[42px] text-[22px] bg-transparent" v-model="Account.data.curUser.companyName"/>
        <p class="text-[24px] mt-[60px]">电子邮件</p>
        <input class="h-[42px] text-[22px] bg-transparent" v-model="Account.data.curUser.email"/>
        <div class="flex flex-row text-[24px] items-center space-x-2 mt-[60px]">
            <p>商品品类</p>
            <div class="text-main-color">*</div>
        </div>
        <div class="flex flex-row space-x-3 mt-[11px]">
            <div v-for="(item, index) in options" :key="index" class="flex flex-row items-center">
                <svg v-if="!item.checked" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.75 4C0.75 2.20507 2.20507 0.75 4 0.75H16C17.7949 0.75 19.25 2.20507 19.25 4V16C19.25 17.7949 17.7949 19.25 16 19.25H4C2.20507 19.25 0.75 17.7949 0.75 16V4Z" fill="#F3F3F3" stroke="#A7A7A7" stroke-width="1.5"/>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.75 4C0.75 2.20507 2.20507 0.75 4 0.75H16C17.7949 0.75 19.25 2.20507 19.25 4V16C19.25 17.7949 17.7949 19.25 16 19.25H4C2.20507 19.25 0.75 17.7949 0.75 16V4Z" fill="#E94902" stroke="#E94902" stroke-width="1.5"/>
                    <path d="M2.99999 10.2729L8.01042 15.1222L17.2028 5.92986" stroke="white" stroke-width="2" stroke-linecap="round"/>
                </svg>

                <label for="icon-checkbox" class="ml-2 text-[16px]">{{ item.title }}</label>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { SetupContext } from "vue"
import { Account } from '@/store/index'

export default {
    name: "UserInfo",
    props: {},

    emits: [],
    components: {},

    setup(props: any, context: SetupContext) {
        const options = [
            { title: '珠宝',     checked: false },
            { title: '美妆',     checked: false },
            { title: '饰品',     checked: false },
            { title: '陶瓷',     checked: false },
            { title: '电子产品', checked: false },
            { title: '其他产品', checked: false }
        ]

        const productCategory = Account.data.curUser.productCategory
        for(let i = 0; i < options.length; i++){
            if(productCategory.includes(options[i].title)){
                options[i].checked = true
            }
        }

        return { options, Account };
    },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
</style>
