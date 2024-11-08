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
            <n-space style="width:100px;height:100px">
                <n-switch style="width:100px;height:100px" v-model:value="active" size="medium">
                <template #icon>
                    🤔
                </template>
                </n-switch>
                <n-switch v-model:value="active" size="large">
                <template #checked-icon>
                    <div class="icon-camera"></div>
                </template>
                <template #unchecked-icon>
                    <div class="icon-camera"></div>
                </template>
                </n-switch>
            </n-space>
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
                <el-button class="media-btn" @click="Camera.methods.open">摄像头已连接</el-button>
                <button class="fab icon-close" @click="close"></button> 
            </div>
        </div>
    </div>
    <el-drawer
        class="drawer"
        :with-header="false"
        :close-on-click-modal="false"
        :model-value="source != ''"
        :before-close="() => { source = '' }">
        <MediaPreview
            :source="source"
            :setting="setting"
            @cancel="cancel"
            @confirm="confirm"
        />
    </el-drawer>
</template>

<script lang="ts">
import { SetupContext, ref } from "vue"

import { ObPlayer } from "ob-xw-common"
import { source, Camera, duration, time, change, isVideo, player, init, TakePhoto, autoExtract, enableBeautify } from "./index"

import SettingPanel from "../SettingPanel/index.vue"

import MediaPreview from '../../MediaPreview/index.vue' 

export default {
  name: "Camera",
  props: {},

  emits: ["close"],
  components: { ObPlayer, SettingPanel, MediaPreview },

  setup(props: any, context: SetupContext) {
    const setting = ref({ bgRemoval: false, beauty: true })
    const active = ref(false)
    function close() {
      context.emit("close");
    }

    function ToggleExtract(value: any){
      autoExtract.value = value;
      setting.value.bgRemoval = value;
    }

    function ChangeSpeed(value: any){
      duration.value = value.duration;
    }

    function cancel(){
        Camera.methods.delete()
        source.value = ''
    }

    function confirm(){
        source.value = ''
    }

    init();

    const isCameraMode = ref(true)

    return { active, setting, source, cancel, confirm, isCameraMode, Camera, duration, ChangeSpeed, ToggleExtract, time, change, isVideo, close, player, init, TakePhoto, autoExtract, enableBeautify };
  },
};
</script>
<style lang="scss">
@import "./local.scss";
</style>
