<template>
  <div class="home-page-root">
    <div class="left">
      <div class="logo"/>
      <div class="menu">
        <div v-for="item in Menu.data.slider" class="item">
          <div :class="['content', Menu.methods.isActived(item) ? 'highlight': '']" @click="Menu.methods.active(item)">
            <span :class="['icon', item.icon]" />
            <span class="title">{{ item.title }}</span>
          </div>
          <span :class="[ Menu.methods.isActived(item) ? 'right-border': '']" />
        </div>
      </div>
    </div>
    <div class="middle">
      <div class="infomation-bar">
        <div class="navi">
            <div class="name">{{ Menu.data.activedItem.title }}</div>
            <div class="free"> Free </div>
        </div>
        <div class="account"></div>
      </div>
      <RouterView />
    </div>
  </div>
</template>

<script lang="ts">
import { Menu } from "@/store/index"

export default {
    name: "HomePage",
    props: {},

    emits: [],
    components: {
    },

    setup(props: any, context: any) {
        return {
            Menu
        };
    },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
</style>
