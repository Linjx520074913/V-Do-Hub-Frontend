<template>
    <div class="w-full h-full flex flex-col">
        <Header class="dragable"/>
        <div class="w-full h-full flex flex-col justify-center">
            <router-view/>
        </div>
        <!-- <Main /> -->
    </div>
</template>

<script>
import Main from "@/components/main/index.vue"
import Header from "@components/header/index.vue";

export default {
    components: { Main, Header },

    setup() {
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
  font-family: "HarmonyOS Sans SC" !important;
  // font-family: 'PingFang SC-Regular', 'PingFang SC'!important;
  overflow: hidden;
}

body {
  font-family: "HarmonyOS Sans SC" !important;
  // font-family: 'PingFang SC-Regular', 'PingFang SC'!important;
}

#app {
  font-family: "HarmonyOS Sans SC";
  // font-family: 'PingFang SC-Regular', 'PingFang SC';
  overflow: hidden;
}

html * {
  // box-sizing: border-box;
  user-select: none;
}

#app * {
  // border: 1px dashed black;
  // transform: scale(1);
}

.dragable {
    -webkit-app-region: drag;
}
</style>
