<template>
    <div class="w-[540px] h-[453px] flex flex-col">
        <div class="flex flex-col w-[508px] h-[192px] mt-[20px] bg-[#F5F5F5] rounded-md ml-auto mr-auto">
            <div class="mt-[30px] ml-auto mr-auto flex flex-row space-x-3">
                <div class="w-[60px] h-[50px] bg-cover 
                    bg-[url('@/assets/images/Swifaigo/VIP_0.png')]"/>
                <div class="w-[232px] h-[53px] bg-cover
                    bg-[url('@/assets/images/Swifaigo/main-logo.png')]"/>
                <div class="w-[65px] h-[29px] bg-cover mt-[18px]
                    bg-[url('@/assets/images/Swifaigo/VIP.png')]"/>
            </div>
            <div class="m-auto w-[422px] h-[56px] bg-main-color text-white rounded-[30px] flex items-center justify-center cursor-pointer"
                @click="showUserZone(1)">
                立即升级
            </div>
        </div>
        <span class="text-[24px] mt-[37px] ml-[20px] cursor-pointer" @click="showUserZone(0)">账户信息设置</span>
        <span class="text-[24px] mt-[37px] ml-[20px]">联系我们</span>
        <span class="border-b border-gray-300 mt-[30px]"/>
        <span class="text-[24px] flex flex-row justify-center items-center mt-auto mb-auto" @click="logout">退出登录</span>
    </div>
</template>

<script lang="ts">
import { SetupContext } from "vue"
import { Menu, Account } from '@/store/index'

export default {
    name: "UserMenu",
    props: {},

    emits: [ 'click' ],
    components: {},

    setup(props: any, context: SetupContext) {

        function showUserZone(param: number){
            Menu.methods.activeAccountZone(param)
            context.emit('click')
        }

        function logout(){
            Account.methods.logout()
        }

        return { showUserZone, logout }
    }
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
</style>
