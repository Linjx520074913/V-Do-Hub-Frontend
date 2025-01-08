<template>
    <div class="floating-window">
        <div v-if="Camera.data.isConnected" class="content">
            <div class="camera-container">
                <div class="absolute top-4 left-10 px-4 py-2 rounded cursor-pointer back" @click="close">
                </div>
                <div class="top">
                    <RJMediaPlayer ref="rjPlayer" 
                    @load="filterLoad"/>
                    <!-- <ObPlayer class="player" ref="player" /> -->
                </div>
                <div class="bottom flex items-center relative">
                    <!-- 居中按钮 -->
                    <div class="green-circle-button absolute left-1/2 -translate-x-1/2" @click="TakePhoto">
                        <p v-if="isVideo">{{ duration }}</p>
                    </div>

                    <!-- 靠右开关 -->
                    <el-switch
                        class="ml-auto self-center custom-switch"
                        v-model="isVideo"
                        @change="change"
                        >
                    </el-switch>
                </div>
            </div>
            <div class="right-panel">
                <SettingPanel 
                :filters="filters"
                :isVideoMode="isVideo"
                @ToggleExtract="ToggleExtract" 
                @close="close"
                @ChangeSpeed="ChangeSpeed"
                @ChangeAngle="ChangeAngle"
                @changeFilterValue="changeFilterValue"
                @changeFilter="changeFilter"/>
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
            v-if="source != ''"
            :source="source"
            :setting="setting"
            :showButton="true"
            @cancel="cancel"
            @confirm="confirm"
        />
    </el-drawer>
</template>

<script lang="ts">
import { SetupContext, ref } from "vue"

import { ObPlayer } from "ob-xw-common"
import { rjPlayer, source, Camera, duration, time, change, isVideo, player, init, TakePhoto, autoExtract, enableBeautify } from "./index"

import SettingPanel from "../SettingPanel/index.vue"

import MediaPreview from '../../MediaPreview/index.vue' 

import RJMediaPlayer from '../../RJMediaPlayer/index.vue'

export default {
    name: "Camera",
    props: {},

    emits: ["close"],
    components: { ObPlayer, SettingPanel, MediaPreview, RJMediaPlayer },

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

        function ChangeAngle(value: any, speed: any){
            if ("slow" == speed.tstr){
                if (360 == value.angle){
                    duration.value = 30;
                } else if (90 == value.angle){
                    duration.value = 30;
                } else if (45 == value.angle){
                    duration.value = 15;
                } else if (30 == value.angle){
                    duration.value = 10;
                } else if (15 == value.angle){
                    duration.value = 5;
                }
            } else if ("fast" == speed.tstr){
                if (360 == value.angle){
                    duration.value = 15;
                } else if (90 == value.angle){
                    duration.value = 15;
                } else if (45 == value.angle){
                    duration.value = 8;
                } else if (30 == value.angle){
                    duration.value = 5;
                } else if (15 == value.angle){
                    duration.value = 3;
                }
            }
        }

        function ChangeSpeed(value: any, angle: any){
            // TODO：这里的duration还需要根据angle和speed一起来计算
            if ("slow" == value.tstr){
                if (360 == angle.angle){
                    duration.value = 30;
                } else if (90 == angle.angle){
                    duration.value = 30;
                } else if (45 == angle.angle){
                    duration.value = 15;
                } else if (30 == angle.angle){
                    duration.value = 10;
                } else if (15 == angle.angle){
                    duration.value = 5;
                }
            } else if ("fast" == value.tstr){
                if (360 == angle.angle){
                    duration.value = 15;
                } else if (90 == angle.angle){
                    duration.value = 15;
                } else if (45 == angle.angle){
                    duration.value = 8;
                } else if (30 == angle.angle){
                    duration.value = 5;
                } else if (15 == angle.angle){
                    duration.value = 3;
                }
            }
        }

        function changeFilter(value: any){
            (rjPlayer.value as any).activeFilter(value)
        }

        function changeFilterValue(value: number){
            (rjPlayer.value as any).changeFilterValue(value)
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
        const filters = ref([] as any)

        function filterLoad(result: any){
            filters.value = result
            console.log('FFAAAAAAAAA', filters)
        }

        return { Camera, ChangeAngle, ChangeSpeed, TakePhoto, ToggleExtract, active, autoExtract, cancel, change, changeFilter, changeFilterValue,
             close, confirm, duration, enableBeautify, filterLoad, filters, init, isCameraMode, isVideo, player, rjPlayer, setting, source, time };
    },
};
</script>
<style lang="scss">
@import "./local.scss";
.back{
    background: url("@/assets/images/Swifaigo/back.png");
    width:104px;
    height: 66px;
}

// .custom-switch {
//   --el-switch-height: 40px !important;
//   --el-switch-width: 80px  !important;
//   --el-switch-border-radius: 20px;
// }

// /* 图片大小自适应 */
// .icon-img {
//   width: 20px;
//   height: 20px;
// }
</style>
