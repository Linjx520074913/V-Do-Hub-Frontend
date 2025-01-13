<template>
    <UserRegister v-if="Account.data.needRegister"/>
    <div v-else class="w-full h-full flex flex-col home-page-root">
        <div class="w-full h-[89px] bg-white flex flex-row items-center justify-between">
            <div class="logo ml-[20px]"/>
            <!-- VIP 信息提示框 -->
            <el-popover
                placement="bottom"
                width="540"
                trigger="manual"
                v-model:visible="isPopoverVisible"
                :teleported="false"
            >
                <div class="w-full h-[600px] flex flex-col p-5">
                    <div class="flex flex-row justify-center items-center mt-5 ">
                        <span class="vip-0"/>
                        <span class="main-logo"/>
                    </div>
                    <p class="text-[24px] mt-5">子账户权限</p>
                    <p class="text-[20px] mt-1">可根据团队人员添加多个子账户权限，高效完成协作工作</p>

                    <p class="text-[24px] mt-5">扩充存储容量</p>
                    <p class="text-[20px]">轻松点击扩充存储容量、照片、资料随心存，告别空间忧虑</p>

                    <p class="text-[24px] mt-5">新增目录</p>
                    <p class="text-[20px] mt-1">一键新增目录，精准定位，畅享便捷制图</p>

                    <p class="text-[24px] mt-5">AI场景图</p>
                    <p class="text-[20px] mt-1">智能开启 AI 背景移除，复杂背景瞬间消散，创意画面随心打造。</p>
                    <div class="flex flex-row w-[282px] h-[56px] bg-main-color text-white rounded-3xl justify-center items-center m-auto cursor-pointer hover:bg-orange-500"
                        @click="elevateMembership">
                        立即升级
                    </div>
                </div>
                <template #reference>
                    <div class="flex flex-row mr-4">
                        <div class="vip-0"/>
                        <div class="vip-1 cursor-pointer" @click="showVIPPrompt"/>
                    </div>
                </template>
            </el-popover>
            <!-- 会员支付页 -->
            <el-dialog
                :model-value="dialogVisible"
                width="1270"
                :show-close="false"
                :before-close="() => { dialogVisible = false }">
                <MemberShip
                @success="() => { dialogVisible = false }"/>
            </el-dialog>
        </div>
        <div class="flex flex-row w-full h-full">
            <div class="left h-full">
                <div class="w-[386px] h-[73px] bg-[#F3F3F3] flex flex-row items-center rounded-lg">
                    <span class="w-[29px] h-[31px] avatar"/>
                    <p class="text-[20px]">账户信息</p>
                </div>
                <div class="menu">
                    <div v-for="item in Menu.data.slider" :class="[ item.visible? 'item': 'hidden' ]" >
                        <div :class="['content h-[47px]', Menu.methods.isActived(item) ? 'highlight text-[#E94504]': '']" @click="Menu.methods.active(item)">
                            <span :class="['icon', item.icon, 'text-[28px]']" />
                            <span class="title text-[26px]">{{ item.title }}</span>
                        </div>
                        <span :class="[ Menu.methods.isActived(item) ? 'right-border': '']" />
                    </div>
                </div>
            </div>
            <div class="middle h-full">
                <div class="infomation-bar flex flex-row items-center justify-between">
                    <div class="navi">
                        <div class="name w-10">{{ Menu.data.activedItem.title }}</div>
                        <div class="free" v-show='Menu.data.activedItem.visible' @click="Menu.methods.activeAccountZone"> Free </div>
                    </div>
                    <!-- <ObDropdownMenu class="flex flex-col justify-center mr-8" :items="dropdownItems"/> -->
                </div>
                <component :is="Menu.data.activedItem.component" class="w-full h-full" v-if="isReady"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Menu } from "@/store/index"
import { showAccountZone } from './index'
import { ObDropdownMenu } from '@/common/templates/index'
import { onMounted, ref, watch } from 'vue'
import { Account, LoginMethod } from '@/store/index'
// import { router, RouterPath } from '@/main'
import UserRegister from '../UserRegister/index.vue'
import { MediaCapture, MediaLibrary, AIScene, MemberShip } from '../index'

export default {
    name: "HomePage",
    props: {},

    emits: [],
    components: { ObDropdownMenu, UserRegister, MediaCapture, MediaLibrary, AIScene, MemberShip },

    setup(props: any, context: any) {
        const isReady = ref(false)
        const visible = ref(true)

        function showVIPPrompt(){
            isPopoverVisible.value = !isPopoverVisible.value;
        }
        const dialogVisible = ref(false)
        const isPopoverVisible = ref(false); // 控制弹窗显示状态

        function elevateMembership(){
            isPopoverVisible.value = false
            dialogVisible.value = true
        }

        const dropdownItems = ref([
            { 
                text: '设置', 
                click: () => { 
                    console.log('设置1')
                    // router.push(RouterPath.USER_ZONE)
                } 
            },
            { 
                text: '登出', 
                click: () => { 
                    Account.methods.logout()
                } 
            }
        ])

        onMounted(() => {
            isReady.value = true
        })   

        return {
            elevateMembership,
            dialogVisible,
            isPopoverVisible,
            showVIPPrompt,
            isReady,
            visible,
            Menu,
            showAccountZone,
            dropdownItems,
            Account
        }
    }
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
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
.avatar{
    background: url('@/assets/images/Swifaigo/avatar.png');
    width: 29px;
    height: 31px;
    margin-left: 20px;
}
</style>
