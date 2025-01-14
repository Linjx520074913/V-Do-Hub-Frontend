<template>
    <div class="w-full h-full flex flex-col home-page-root">
        <div class="flex flex-row w-full h-full">
            <div class="left h-full">
                <div class="w-full h-[89px] shadow z-10 flex">
                    <div class="w-[232px] h-[53px] ml-[19px] bg-cover mt-auto mb-auto
                        bg-[url('@/assets/images/Swifaigo/main-logo.png')]"/>
                </div>
                <div class="menu mt-[106px]">
                    <div v-for="item in Menu.data.slider" :class="[ item.visible? 'item': 'hidden' ]" >
                        <div :class="['content h-[47px]', Menu.methods.isActived(item) ? 'highlight text-[#E94504]': '']" @click="Menu.methods.active(item)">
                            <span :class="['icon', item.icon, 'text-[28px]']" />
                            <span class="title text-[20px]">{{ item.title }}</span>
                        </div>
                    </div>
                </div>
                <span class="border border-[#E6E6E6]"/>
                <div class="h-[50px] w-full flex items-center ml-[27px] text-[#6A6A6A]">
                    @2024 SwifCam.app, Inc
                </div>
            </div>
            <div class="middle h-full">
                <div class="flex flex-row justify-between mb-[46px]">
                        <div class="ml-[50px] text-[30px]">{{ Menu.data.activedItem.title }}</div>
                        <!-- VIP 信息提示框 -->
                        <el-popover
                            placement="bottom"
                            width="540"
                            trigger="manual"
                            v-model:visible="isPopoverVisible"
                            :teleported="false"
                        >
                            <UserMenu/>
                            <!-- <div class="w-full h-[600px] flex flex-col p-5">
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
                            </div> -->
                            <template #reference>
                                <div class="flex flex-row mr-4 items-center">
                                    <div class="vip-0"/>
                                    <span class="avatar cursor-pointer" @click="showVIPPrompt"/>
                                    <div class=" ml-[15px] cursor-pointer" @click="showVIPPrompt">账号信息</div>
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
                <component :is="Menu.data.activedItem.component" class="w-full h-full px-[50px]" v-if="isReady"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Menu } from "@/store/index"
import { showAccountZone } from './index'
import { ObDropdownMenu } from '@/common/templates/index'
import { onMounted, ref } from 'vue'
import { Account } from '@/store/index'
import UserRegister from '../UserRegister/index.vue'
import { MediaCapture, MediaLibrary, AIScene, MemberShip } from '../index'
import UserMenu from './UserMenu/index.vue'

export default {
    name: "HomePage",
    props: {},

    emits: [],
    components: { UserMenu, ObDropdownMenu, UserRegister, MediaCapture, MediaLibrary, AIScene, MemberShip },

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
<style lang="scss">
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
.el-popover {
  padding: 0 !important;
}
</style>
