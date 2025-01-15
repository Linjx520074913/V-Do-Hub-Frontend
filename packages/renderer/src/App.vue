<template>
    <router-view></router-view>
</template>

<script>
import { onMounted, ref, computed } from 'vue'
import { Account } from '@/store/index'

export default {
    components: {  },

    setup() {
        onMounted(() => {
            console.log('=== login with default token ===')
            Account.methods.loginWithToken()
        })
        
        const currentComponent = computed(() => { 
            return ref(!Account.data.isLogin ? 'UserLogin' : 'Main') }
        );  

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
    font-family: 'PingFang SC-Regular', 'PingFang SC'!important;
    background: transparent; 
}

#app {
//   font-family: "Microsoft YaHei";
    font-family: 'AlibabaPuHuiTi-3-55-RegularL3';
    overflow: hidden;
    color: #000;
    font-weight: normal;
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
