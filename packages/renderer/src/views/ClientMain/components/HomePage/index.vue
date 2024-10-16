<template>
  <div class="home-page-root">
    <div class="left">
      <div class="logo"/>
      <div class="menu">
        <div v-for="item in menu" class="item">
          <div :class="['content', selectedItem.title == item.title ? 'highlight': '']" @click="handleClickMenuItem(item)">
            <span :class="['icon', item.icon]" />
            <span class="title">{{ item.title }}</span>
          </div>
          <span :class="[selectedItem.title == item.title ? 'right-border': '']" />
        </div>
      </div>
    </div>
    <div class="middle">
      <div class="infomation-bar">
        <div class="navi">
          <div class="name">{{ selectedItem.title }}</div>
          <div class="free"> Free </div>
        </div>
        <div class="account"></div>
      </div>
      <RouterView />
    </div>
  </div>
</template>

<script lang="ts">
import { SetupContext, onMounted, ref } from "vue";
import { FloatWindowTemplate, ObMessage, ObProgress } from "@/common/templates";
import { t } from "@/components/index";
import { Props } from "@/common/export/interface";

import { menu, handleClickMenuItem, selectedItem } from "./index";
import { ObPlayer } from "ob-xw-common";

export default {
  name: "HomePage",
  props: {},

  emits: [],
  components: {
    FloatWindowTemplate,
    ObMessage,
    ObProgress,
    ObPlayer,
  },

  setup(props: Props<any>, context: SetupContext) {
    return {
      t,
      FloatWindowTemplate,
      ObMessage,
      menu,
      selectedItem,
      handleClickMenuItem,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
</style>
