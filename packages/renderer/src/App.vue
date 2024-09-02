<template>
  <!-- 主布局 从上往下 -->
  <!-- 菜单栏 -->
  <!-- 内容区 -->
  <!-- 状态栏 -->
  <n-notification-provider placement="bottom-right">
    <n-message-provider :max="1">
      <n-dialog-provider>
        <Main />
      </n-dialog-provider>
    </n-message-provider>
  </n-notification-provider>
</template>

<script>
import Main from "@/components/main/index.vue";
import { Platform } from "./components/index";
import { onMounted } from "vue";

export default {
  components: { Main },

  setup() {
    // onMounted(() => {
    // 	console.log("cur platform: ", Platform.type);
    // 	if (!Platform.computed.isDarwin) {
    // 		import("./global.scss").then(() => {});
    // 	}
    // });
  },
};
</script>

<style lang="scss" scoped>
// @import "@/common/styles/elementPlusDefault.scss";
</style>

<style lang="scss">
@import "@/common/styles/global.scss";

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
</style>
