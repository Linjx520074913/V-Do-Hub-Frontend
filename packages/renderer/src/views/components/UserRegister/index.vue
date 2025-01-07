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
                <div class="checkbox-group">
                <label v-for="(category, index) in categories" :key="index">
                <input 
                    type="checkbox" 
                    :value="category" 
                    v-model="form.selectedCategories" 
                />
                {{ category }}
                </label>
            </div>
            </div>
        </div>
        <!-- 注册按钮 -->
        <div class="w-[359px] h-[45px] rounded-3xl flex flex-row justify-center items-center bg-main-color mt-20 text-white hover:bg-orange-500 hover:border-orange-600 hover:shadow-lg cursor-pointer transition duration-200"
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
        const categories = ref(['珠宝', '美妆', '饰品', '陶瓷', '电子产品', '其他'])

        function quit(){
            Account.methods.logout()
            ipcRenderer.send(ObEvent.WINDOW_CLOSE)
        }

        async function register(){
            if (form.value.selectedCategories.length == 0) {
                alert('珠宝是必选项，请选择珠宝！');
                return
            }
            console.log('!!!!!!!!!!!!', form.value.selectedCategories)
            const isSuccess = await Account.methods.register(form.value.email, form.value.company, form.value.selectedCategories, Account.data.curUser.phone, Account.data.curSmsCode)
            ElMessage({
                message: isSuccess? '注册成功!' : '注册失败',
                type: isSuccess? 'success' : 'error',
            });
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
