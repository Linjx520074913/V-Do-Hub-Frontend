<template>
    <div class="floating-window flex">
        <div v-if="Camera.data.isConnected" class="w-full h-full flex flex-row">
            <!-- 左侧相机数据显示区域 -->
            <div class="relative flex flex-col flex-1 items-center">
                <!-- 左上角关闭按钮 -->
                <div class="absolute mt-[27px] left-10 w-[104px] h-[66px] px-4 py-2 rounded cursor-pointer
                    bg-[url('@/assets/images/Swifaigo/back.png')]" @click="close">
                </div>
                <div class="flex w-[1200px] h-[860px] mt-[27px] bg-[#EEF0F4]">
                    <RJMediaPlayer ref="rjPlayer" class="m-auto"
                    @load="filterLoad"/>
                </div>
                <div class="relative w-full flex-1 flex">
                    <!-- 居中按钮 -->
                    <div class="w-[100px] h-[100px] border border-black m-auto" @click="TakePhoto">
                        <p v-if="isVideo">{{ duration }}</p>
                        a
                        <ProgressTimer/>
                    </div>


                    <!-- 靠右开关 -->
                    <el-switch
                        class="absolute right-[20px] top-1/2 transform -translate-y-1/2"
                        v-model="isVideo"
                        @change="change"
                        >
                    </el-switch>
                </div>
            </div>
            <!-- 右侧参数显示面板 -->
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
        <!-- 设备未连接提示 -->
        <div v-else class="relative  flex flex-col items-center w-[669px] h-[479px] m-auto bg-white filter drop-shadow-[0_0_10px_rgba(0,0,0,0.2)] rounded-lg">
            <div class="w-[512px] h-[278px] bg-[url('@/assets/images/Swifaigo/prompt.png')] bg-cover"/>
            <p class="text-[20px] text-black mt-[40px]">确保您的SwifCam已经正确连接到电脑</p>
            <div class="mt-auto mb-[50px] w-[562px] h-[42px] rounded bg-main-color flex justify-center items-center text-white text-[20px] cursor-pointer" @click="Camera.methods.open"> SwifCam 已连接 </div>
            <!-- 右上角关闭按钮 -->
            <div class="absolute top-0 right-0 m-4 text-[#A7A7A7] px-2 py-1 rounded icon-close cursor-pointer" @click="close"/>
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

import ProgressTimer from './ProgressTimer/index.vue'

export default {
    name: "Camera",
    props: {},

    emits: ["close"],
    components: { ObPlayer, SettingPanel, MediaPreview, RJMediaPlayer, ProgressTimer },

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
                    duration.value = 31;
                } else if (90 == value.angle){
                    duration.value = 32;
                } else if (45 == value.angle){
                    duration.value = 17;
                } else if (30 == value.angle){
                    duration.value = 12;
                } else if (15 == value.angle){
                    duration.value = 7;
                }
            } else if ("fast" == speed.tstr){
                if (360 == value.angle){
                    duration.value = 15;
                } else if (90 == value.angle){
                    duration.value = 17;
                } else if (45 == value.angle){
                    duration.value = 10;
                } else if (30 == value.angle){
                    duration.value = 7;
                } else if (15 == value.angle){
                    duration.value = 5;
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
