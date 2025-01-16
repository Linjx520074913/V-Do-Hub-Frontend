<template>
    <div class="w-full h-full flex flex-col home-page-root">
        <div class="flex flex-row w-full h-full">
            <!-- 左侧菜单栏 -->
            <div class="left h-full">
                <!-- 影智速拍 logo -->
                <div class="w-full h-[89px] shadow z-10 flex">
                    <div class="w-[232px] h-[53px] ml-[19px] bg-cover mt-auto mb-auto
                        bg-[url('@/assets/images/Swifaigo/main-logo.png')]"/>
                </div>
                <!-- 菜单项 -->
                <div class="menu mt-[106px]">
                    <div v-for="item in Menu.data.slider" :class="[ item.visible? 'item': 'hidden' ]" >
                        <div :class="['content h-[47px]', Menu.methods.isActived(item) ? 'highlight text-[#E94504]': '']" @click="Menu.methods.active(item)">
                            <span :class="['ml-[23px] icon text-[28px]', item.icon]" />
                            <span class="title text-[20px]">{{ item.title }}</span>
                        </div>
                    </div>
                </div>
                <!-- 分割线 -->
                <span class="border border-[#E6E6E6]"/>
                <!-- 信息说明 -->
                <div class="h-[50px] w-full flex items-center ml-[27px] text-[#6A6A6A]">
                    @2024 SwifCam.app, Inc
                </div>
            </div>
            <!-- 右侧工作区 -->
            <div class="middle h-full">
                <!-- 右侧顶部信息栏，包含当前模块名，账号入口-->
                <div class="flex flex-row justify-between mt-[10px] mb-[36px]">
                    <div class="ml-[50px] text-[30px]">{{ Menu.data.activedItem.title }}</div>
                    <!-- VIP 信息提示框 -->
                    <el-popover
                        placement="bottom"
                        width="540"
                        trigger="manual"
                        v-model:visible="isPopoverVisible"
                        :teleported="false"
                    >
                        <UserMenu @click="() => { isPopoverVisible = false }"/>
                        <template #reference>
                            <div class="flex flex-row mr-4 items-center">
                                <div class="vip-0"/>
                                <span class="avatar cursor-pointer" @click="showVIPPrompt"/>
                                <div class=" ml-[15px] cursor-pointer" @click="showVIPPrompt">账号信息</div>
                            </div>
                        </template>
                    </el-popover>
                </div>
                <!-- 与菜单对应的子路由 -->
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Menu } from "@/store/index"
import { showAccountZone } from './index'
import { ObDropdownMenu } from '@/common/templates/index'
import { onMounted, ref } from 'vue'
import { Account, Router } from '@/store/index'
import UserRegister from '../UserRegister/index.vue'
import { MediaCapture, MediaLibrary, AIScene } from '../index'
import UserMenu from './UserMenu/index.vue'

export default {
    name: "HomePage",
    props: {},

    emits: [],
    components: { UserMenu, ObDropdownMenu, UserRegister, MediaCapture, MediaLibrary, AIScene },

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

        onMounted(() => {
            isReady.value = true

            // Router.methods.to('/main/homepage/media_library')
            Router.methods.to('/main/homepage/media_capture')
            // Router.methods.to('/main/homepage/user_zone')
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
