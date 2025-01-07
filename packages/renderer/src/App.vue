<template>
    <div class="flex flex-row w-full h-full justify-center items-center">
        <keep-alive>
            <component :is="currentComponent.value" class="w-full h-full" />
        </keep-alive>
    </div>
</template>

<script>
import Main from "@/components/main/index.vue"
import Header from "@components/header/index.vue";
import Footer from "@components/footer/index.vue"
import { onMounted, ref, watch, computed } from 'vue'
import { Account, LoginMethod } from '@/store/index'
import { Setting, MediaLibrary, MediaCapture, Mall, UserLogin, UserRegister, UserZone, AIScene } from './views/components/index'

export default {
    components: { Main, Header, Footer, UserLogin, AIScene, UserZone, UserRegister },

    setup() {
        onMounted(() => {
            console.log('=== login with default token ===')
            Account.methods.loginWithToken()
        })
        
        const currentComponent = computed(() => { 
            return ref(!Account.data.isLogin ? 'UserLogin' : 'Main') }
        );

        // TODO: 这里要改
        // const currentComponent = computed(() => Account.data.isLogin ? 'Main' : 'Main');

        return { Account, currentComponent }
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
