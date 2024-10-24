<template>
  <div class="floating-window">
    <div v-if="Camera.data.isConnected" class="content">
      <div class="camera-container">
        <div class="top">
          <ObPlayer class="player" ref="player" />
        </div>
        <div class="bottom">
          <div class="green-circle-button" @click="TakePhoto">
            <p v-if="isVideo">{{ duration }}</p>
          </div>
          <el-switch
            v-model="isVideo"
            @change="change"
            active-color="#13ce66"
            inactive-color="#ff4949"
            style="margin: 0px 30px 40px 0">
          </el-switch>
        </div>
      </div>
      <div class="right-panel">
        <SettingPanel :isVideoMode="isVideo" 
          @ToggleExtract="ToggleExtract" 
          @close="close"
          @ChangeSpeed="ChangeSpeed"/>
      </div>
    </div>
    <div v-else class="no-camera-prompt">
        <div class="popup">
            <div class="device"/>
            <p style="margin: 20px 0px 20px 0px">确保您的摄像头已正确连接到您的笔记本电脑</p>
            <ObButton
              text="摄像头已连接"
              icon="icon-quit"
              class="media-btn"
              @click="Camera.methods.open"
              />
            <button class="fab icon-close" @click="close"></button> 
        </div>
    </div>
  </div>
  <teleport to=".home-page-root">
    <Preview
      v-if="isPreviewVisible"
      :data="data"
      :isPhoto="!isVideo"
      :videoPath="videoPath"
      :autoExtract="autoExtract"
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
import { Camera, videoPath, data, duration, filePath, time, change, isVideo, player, init, enable, TakePhoto, isPreviewVisible, autoExtract, enableBeautify } from "./index";

import Preview from "../Preview/index.vue";
import SettingPanel from "../SettingPanel/index.vue";

import { ObButton } from "@/common/templates/index";

export default {
  name: "Camera",
  props: {},

  emits: ["close"],
  components: { ObPlayer, Preview, ObButton, SettingPanel },

  setup(props: Props<any>, context: SetupContext) {
    function close() {
      context.emit("close");
    }

    function ToggleExtract(value: any){
      autoExtract.value = value;
    }

    function ChangeSpeed(value: any){
      duration.value = value.duration;
      console.log("FFFChangeSpeed ", duration.value);
    }

    init();

    return { Camera, videoPath, data, duration, ChangeSpeed, ToggleExtract, filePath, time, change, isVideo, close, player, init, enable, TakePhoto, isPreviewVisible, autoExtract, enableBeautify };
  },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
</style>
