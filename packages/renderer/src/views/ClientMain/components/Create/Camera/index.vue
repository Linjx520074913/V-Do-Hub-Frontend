<template>
  <div class="floating-window">
    <div class="content">
      <div class="camera-container">
        <div class="top">
          <ObPlayer class="player" ref="player" />
        </div>
        <div class="bottom"></div>
      </div>
      <div class="camera-setting"></div>
      <!-- <button @click="close">关闭</button> -->
    </div>
  </div>
</template>

<script lang="ts">
import { SetupContext, onMounted, ref } from "vue";
import { Props } from "@/common/export/interface";

import { ObPlayer } from "ob-xw-common";
import { player, init } from "./index";

export default {
  name: "Camera",
  props: {},

  emits: ["close"],
  components: { ObPlayer },

  setup(props: Props<any>, context: SetupContext) {
    function close() {
      context.emit("close");
    }

    init();

    return { close, player, init };
  },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
</style>
