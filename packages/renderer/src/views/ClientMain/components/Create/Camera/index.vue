<template>
  <div class="floating-window">
    <div class="content">
      <div class="camera-container">
        <div class="top">
          <ObPlayer class="player" ref="player" />
        </div>
        <div class="bottom">
          <div class="green-circle-button" @click="TakePhoto"></div>
        </div>
      </div>
      <div class="camera-setting">
        <div class="panel">
          <div class="item">
            <p>设备</p>
            <p>a</p>
          </div>
          <div class="divider" />
          <div class="item">
            <p>转盘</p>
            <el-switch />
          </div>
        </div>
        <div class="panel">
          <div class="item">
            <p>自动对焦</p>
            <p>a</p>
          </div>
        </div>
        <div class="panel">
          <div class="item">
            <p>缩放</p>
            <p>a</p>
          </div>
        </div>
        <div class="panel">
          <div class="item">
            <p>分辨率</p>
          </div>
          <select name="cars" id="cars">
            <option value="volvo">2160x2160px</option>
            <option value="saab">1920x1080px</option>
          </select>
          <div class="item">
            <input type="checkbox" name="interest" value="football" />
            <p>将照片保存为300dpi</p>
            <div></div>
          </div>
        </div>
        <div class="panel">
          <div class="item">
            <p>启用LOGO水印</p>
            <el-switch v-model="enable" />
          </div>
        </div>
        <div class="panel">
          <div class="item">
            <p>媒体保存到本地磁盘</p>

            <el-switch />
          </div>
        </div>
        <button @click="close">关闭</button>
      </div>
    </div>
  </div>
  <teleport to=".home-page-root">
    <Preview
      v-if="isPreviewVisible"
      @close="
        () => {
          isPreviewVisible = false;
        }
      "
    />
  </teleport>
</template>

<script lang="ts">
import { SetupContext, onMounted, ref } from "vue";
import { Props } from "@/common/export/interface";

import { ObPlayer } from "ob-xw-common";
import { player, init, enable, TakePhoto, isPreviewVisible } from "./index";

import Preview from "../Preview/index.vue";

export default {
  name: "Camera",
  props: {},

  emits: ["close"],
  components: { ObPlayer, Preview },

  setup(props: Props<any>, context: SetupContext) {
    function close() {
      context.emit("close");
    }

    init();

    return { close, player, init, enable, TakePhoto, isPreviewVisible };
  },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
</style>
