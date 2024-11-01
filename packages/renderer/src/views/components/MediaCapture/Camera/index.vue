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
    <!-- <teleport to=".home-page-root">
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
    </teleport> -->
    <el-drawer
        class="drawer"
        :with-header="false"
        :model-value="source != ''"
        :before-close="() => { source = '' }">
        <MediaPreview
            :source="source"
            @cancel="() => { source = '' }"
            @confirm="() => { source = '' }"
        />
    </el-drawer>
</template>

<script lang="ts">
import { SetupContext, ref } from "vue"

import { ObPlayer } from "ob-xw-common"
import { source, Camera, videoPath, data, duration, time, change, isVideo, player, init, enable, TakePhoto, autoExtract, enableBeautify } from "./index"

import Preview from "../Preview/index.vue"
import SettingPanel from "../SettingPanel/index.vue"

import { ObButton } from "@/common/templates/index"

import MediaPreview from '../../MediaPreview/index.vue' 

export default {
  name: "Camera",
  props: {},

  emits: ["close"],
  components: { ObPlayer, Preview, ObButton, SettingPanel, MediaPreview },

  setup(props: any, context: SetupContext) {
    function close() {
      context.emit("close");
    }

    function ToggleExtract(value: any){
      autoExtract.value = value;
    }

    function ChangeSpeed(value: any){
      duration.value = value.duration;
    }

    function cancel(){
        console.log('cancel')
    }

    function confirm(){
        console.log('confirm')
    }

    init();

    const isCameraMode = ref(true)

    return { source, cancel, confirm, isCameraMode, Camera, videoPath, data, duration, ChangeSpeed, ToggleExtract, time, change, isVideo, close, player, init, enable, TakePhoto, autoExtract, enableBeautify };
  },
};
</script>
<style lang="scss">
@import "./local.scss";
</style>
