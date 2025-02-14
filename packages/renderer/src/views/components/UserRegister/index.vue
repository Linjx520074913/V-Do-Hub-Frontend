<template>
    <div class="relative  flex flex-col rounded-lg w-[1145px] h-[745px] items-center bg-white shadow-2xl pl-[87px]">
        <!-- 关闭按钮 -->
        <button class="icon-close absolute top-2 right-2 text-gray-300 hover:text-gray-700 px-4 py-2 rounded" @click="quit"/>
        <!-- 账号注册 -->
        <div class="mt-[35px] text-3xl">
            账号注册
        </div>
        <!-- 影智速拍账号 -->
        <div class="w-full flex flex-row text-[30px] items-center">
            <div class="logo"/>
            影智速拍账号
        </div>
        <!-- 分割线 -->
        <div class="w-full h-[1px] border-t border-gray-300 mt-2 mb-2"></div>
        <!-- 信息填写区域 -->
        <div class="w-full flex flex-row mt-10">
            <!-- 左侧 -->
            <div class="flex flex-col mr-5 flex-1 pr-20">
                <p class="text-[20px]">手机号码</p>
                <input
                    type="text"
                    v-model="Account.data.curUser.phone"
                    placeholder="请输入手机号码"
                    class="border-b border-gray-300 focus:outline-none focus:border-blue-500 transition duration-200 mt-4"/>

                <p class="text-[20px]  mt-8">验证码</p>
                <div class="flex flex-row">
                    <input
                    type="text"
                    placeholder="请输入验证码"
                    v-model="Account.data.curSmsCode"
                    class="w-2/3 border-b border-gray-300 focus:outline-none focus:border-blue-500 transition duration-200  mt-4"/>
                    <div class="flex-1 flex flex-row justify-center items-center bg-main-color hover:bg-orange-500 cursor-pointer rounded-3xl text-white"
                        @click="Account.methods.sendPhoneVerificationCode(Account.data.curUser.phone)">
                        获取验证码
                    </div>
                </div>

                <p class="text-[20px]  mt-8">公司名称</p>
                <input
                    type="text"
                    v-model="form.company"
                    placeholder="请输入公司名称"
                    class="border-b border-gray-300 focus:outline-none focus:border-blue-500 transition duration-200  mt-4"/>

                <p class="text-[20px]  mt-8">邮箱</p>
                <input
                    type="text"
                    v-model="form.email"
                    placeholder="请输入邮箱"
                    class="border-b border-gray-300 focus:outline-none focus:border-blue-500 transition duration-200  mt-4"/>
            </div>
            <!-- 右侧 -->
            <div class="flex flex-col  flex-1">
                <p class="text-[26px]">商品品类*</p>
                <div class="grid grid-cols-3 grid-rows-3 gap-4 mt-[10px]">
                    <div v-for="(category, index) in categories" :key="index" class="flex flex-row">
                        <svg class="mr-[10px]" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" @click="() => { category.checked = !category.checked }">
                            <path v-if="!category.checked" d="M0.75 4C0.75 2.20507 2.20507 0.75 4 0.75H16C17.7949 0.75 19.25 2.20507 19.25 4V16C19.25 17.7949 17.7949 19.25 16 19.25H4C2.20507 19.25 0.75 17.7949 0.75 16V4Z" fill="#F3F3F3" stroke="#A7A7A7" stroke-width="1.5"/>
                            <path v-if="category.checked" d="M0.75 4C0.75 2.20507 2.20507 0.75 4 0.75H16C17.7949 0.75 19.25 2.20507 19.25 4V16C19.25 17.7949 17.7949 19.25 16 19.25H4C2.20507 19.25 0.75 17.7949 0.75 16V4Z" fill="#E94902" stroke="#E94902" stroke-width="1.5"/>
                            <path v-if="category.checked" d="M2.99999 10.2729L8.01042 15.1222L17.2028 5.92986" stroke="white" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        {{ category.title }}
                    </div>
                </div>
            </div>
        </div>
        <!-- 注册按钮 -->
        <div class="w-[359px] h-[45px] mt-auto mb-auto rounded-3xl flex flex-row justify-center items-center bg-main-color text-white hover:bg-orange-500 hover:border-orange-600 hover:shadow-lg cursor-pointer transition duration-200"
            @click="register">
            注册
        </div>
    </div>
</template>

<script lang="ts">
import { SetupContext, ref, computed } from "vue"

import { ipcRenderer } from 'electron';
import { ObEvent } from "@common/";
import { Account } from '@/store/index'
import { ElMessage } from 'element-plus';

export default {
    name: "UserRegister",
    props: {},

    emits: [],
    components: {},

    setup(props: any, context: SetupContext) {

        const form = ref({
            company: '',
            email: '',
            selectedCategories: [] as string[],  // 用于存储勾选的商品品类
            otherCategory: '' as string      // 备注说明
        })
        const categories = ref([
            { title: '珠宝',     checked: false },
            { title: '美妆',     checked: false },
            { title: '饰品',     checked: false },
            { title: '陶瓷',     checked: false },
            { title: '电子产品', checked: false },
            { title: '其他',     checked: false }
        ])

        function quit(){
            Account.methods.logout()
            ipcRenderer.send(ObEvent.WINDOW_CLOSE)
        }

        async function register(){
            const selected = categories.value.filter( item => item.checked )
                                             .map(item => item.title)
            if (selected.length == 0) {
                alert('珠宝是必选项，请选择珠宝！');
                return
            }
            const isSuccess = await Account.methods.register(form.value.email, form.value.company, selected, Account.data.curUser.phone, Account.data.curSmsCode)
            ElMessage({
                message: isSuccess? '注册成功!' : '注册失败',
                type: isSuccess? 'success' : 'error',
            });

            // 重新刷新页面
            if(isSuccess){
                ipcRenderer.send(ObEvent.WINDOW_RELOAD, {})
            }
            
        }
        return { quit, Account, categories, form, register }
    },
};
</script>
<style lang="scss" scoped>
.logo{
    background-image: url('@/assets/images/Swifaigo/logo.png');
    width: 61px;
    height: 56px;
}
</style>
