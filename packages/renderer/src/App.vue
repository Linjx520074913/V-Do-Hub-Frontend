<template>
    <!-- <div class="w-full h-full flex flex-col" v-if="Account.data.isLogin">
        <Header class="dragable"/>
        <div class="w-full h-full flex flex-col justify-center">
            <Main/>
        </div>
    </div>
    <UserLogin v-else class="w-full h-full"/> -->
    <div class="w-full h-full flex flex-col">
        <Header class="dragable"/>
        <div class="w-full h-full flex flex-col justify-center">
            <Main/>
        </div>
    </div>
</template>

<script>
import Main from "@/components/main/index.vue"
import Header from "@components/header/index.vue";
import { onMounted, ref } from 'vue'
import { Account, LoginMethod } from '@/store/index'
import { Setting, MediaLibrary, MediaCapture, Mall, UserLogin, UserRegister, UserZone, AIScene } from './views/components/index'

export default {
    components: { Main, Header, UserLogin, AIScene, UserZone },

    setup() {
        onMounted(() => {
            Account.methods.loginWithToken()
        })
        return { Account }
    },
};
</script>

<style lang="scss" scoped>
// @import "@/common/styles/elementPlusDefault.scss";
</style>

<style lang="scss">
@import "@/common/styles/global.scss";
$header-height: 35px;
$footer-height: 30px;
html {
//   font-family: "Microsoft YaHei" !important;
    font-family: 'PingFang SC-Regular', 'PingFang SC'!important;
    overflow: hidden;
    background: transparent; 
}

body {
//   font-family: "Microsoft YaHei" !important;
    font-family: 'PingFang SC-Regular', 'PingFang SC'!important;
    background: transparent; 
}

#app {
//   font-family: "Microsoft YaHei";
    font-family: 'PingFang SC-Regular', 'PingFang SC';
    overflow: hidden;
    color: #363E5C
}

html * {
    // box-sizing: border-box;
    user-select: none;
    
}

#app * {
  // border: 1px dashed black;
  // transform: scale(1);
//   background: transparent; 
}

.dragable {
    -webkit-app-region: drag;
}
</style>
