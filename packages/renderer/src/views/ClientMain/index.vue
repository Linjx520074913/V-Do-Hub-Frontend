<template>
  <HomePage class="checkerboard" />
</template>

<script lang="ts">
import { computed } from "vue";
import { FloatWindowTemplate, ObMessage, ObProgress } from "@/common/templates";
import { HomePage } from "./components/index";
import { t, SelectLocal, Platform, UI, Sudoer } from "@/components/index";

export default {
  name: "ClientMain",

  components: {
    FloatWindowTemplate,
    ObMessage,
    ObProgress,
    HomePage,
  },

  setup() {
    return {
      t,
      Platform,
      SelectLocal,
      UI,
      Sudoer,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./local.scss";
</style>

<style lang="scss">
@import "@/common/styles/global.scss";
</style>
