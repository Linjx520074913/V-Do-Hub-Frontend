<template>
  <div class="camera-setting">
        <div class="panel">
          <div class="item">
            <p class="text-[18px]">设备</p>
            <p>SwifAI Camera</p>
          </div>
          <div class="divider" />
          <div v-if="isVideoMode">
            <div class="item">
              <p>转盘角度设置</p>
            </div>
            <div class="menu">
                <div :class="['menu-item', angle.text == cur_angle.text? 'menu-item-highlight': '']" v-for="angle in AngleOptions" @click="ChangeAngle(angle, cur_speed)">
                {{ angle.text }}
              </div>
            </div>
            <div class="panel">
              <div class="item">
                <p>转盘速度设置</p>
              </div>
              <div class="menu">
                <div :class="['menu-item', speed.text == cur_speed.text? 'menu-item-highlight': '']" v-for="speed in SpeedOptions" @click="ChangeSpeed(speed, cur_angle)">
                {{ speed.text }}
              </div>
            </div>
            </div>
          </div>
          
        </div>
        <div class="panel">
          <div class="item">
            <p class="text-[18px]">SwifAI</p>
          </div>
          <table style="width:100%">
            <tr>
              <td><el-checkbox class="extractor" @change="ToggleExtract" v-model="enableExtract">AI 抠图</el-checkbox></td>
              <td><el-checkbox class="beautifier" disabled>AI 磨皮</el-checkbox></td>
              <td><el-checkbox class="beautifier" disabled>AI 除尘</el-checkbox></td>
            </tr>
          </table>
        </div>
        <div class="panel">
            <div class="item">
                <p class="text-[18px]">滤镜</p>
            </div>
            <div class="filter-container px-3">
                <div 
                    :class="['filter-item flex flex-col justify-center items-center cursor-pointer', currentFilter.shortName == content.shortName ? 'border-orange-600' : '']"
                    v-for="(content, index) in filters" 
                    :key="index"
                    @click="activeFilter(content)"
                >
                <img :src="content.coverUrl"/>
                <p class="text-[15px] m-auto">{{ content.shortName }}</p>
                </div>
            </div>
            <div class="flex flex-col w-5/6 px-3 mt-2">
                <!-- <span class="text-[15px]">程度  :   {{ Camera.data.smoothness }}</span>
                <el-slider v-model="Camera.data.smoothness" @input="Camera.methods.setSmoothness"></el-slider> -->
                <span class="text-[15px]">程度  :   {{ currentFilterValue }}</span>
                <el-slider @input="slide" v-model="currentFilterValue" />
            </div>
        </div>
        <div class="panel">
            <div class="item">
                <p class="text-[18px]">磨皮 {{ Camera.data.smoothness }}</p>
            </div>
            <div class="flex flex-col w-5/6 px-2">
                <el-slider v-model="Camera.data.smoothness" @input="Camera.methods.setSmoothness"></el-slider>
            </div>
        </div>
        <div class="panel">
            <div class="item">
                <p class="text-[18px]">调整</p>
            </div>
            <div class="px-4">
                <div class="flex flex-col w-5/6">
                    <span class="text-[15px]">亮度  :   {{ Camera.data.brightness }}</span>
                    <el-slider v-model="Camera.data.brightness" @input="Camera.methods.setBrightness"></el-slider>
                </div>
                <div class="flex flex-col w-5/6">
                    <span>
                    <table style="width:100%">
                        <tr>
                        <td class="text-[15px]" style="text-align: left;">焦距  :   {{ Camera.data.focus }} </td>
                        <td style="text-align: right;">
                        <el-checkbox v-model="Camera.data.af_mode" @change="Camera.methods.switchAutoFocus"></el-checkbox>自动
                        </td>
                        </tr>
                    </table>
                    </span>
                    <el-slider v-model="Camera.data.focus" @input="Camera.methods.setFocus"></el-slider>
                </div>
                <div class="flex flex-col w-5/6">
                    <span class="text-[15px]">色调  :   {{ Camera.data.hue }}</span>
                    <el-slider v-model="Camera.data.hue" @input="Camera.methods.setHue"></el-slider>
                </div>
                <div class="flex flex-col w-5/6">
                    <span class="text-[15px]">饱和度  :   {{ Camera.data.saturation }}</span>
                    <el-slider v-model="Camera.data.saturation" @input="Camera.methods.setSaturation"></el-slider>
                </div>
                <div class="flex flex-col w-5/6">
                    <span class="text-[15px]">锐度  :   {{ Camera.data.sharpness }}</span>
                    <el-slider v-model="Camera.data.sharpness" @input="Camera.methods.setSharpness"></el-slider>
                </div>
                <div class="flex flex-col w-5/6">
            </div>
            
                <span class="text-[15px]">对比度  :   {{ Camera.data.contrast }}</span>
                <el-slider v-model="Camera.data.contrast" @input="Camera.methods.setContrast"></el-slider>
            </div>
        </div>
        <div class="panel">
          <div class="item">
            <p class="text-[18px]">分辨率</p>
          </div>
          <select name="resolution" id="resolution">
            <option value="43_1920">4:3 1920x1440</option>
            <option value="43_4K">4:3 4000x3000</option>
            <option value="43_1600">4:3 1600x1200</option>
            <option value="s_3000">1:1 3008x3008</option>
            <option value="s_2160">1:1 2160x2160</option>            
            <option value="169_1920">16:9 1920x1080</option>
            <option value="169_3840">16:9 3840x2160</option>
          </select>
          <div class="item">
            <input type="checkbox" name="interest" value="football" />
            <p>将照片保存为300dpi</p>
            <div></div>
          </div>
        </div>
        <div class="panel">
          <div class="item">
            <p class="text-[18px]">启用LOGO水印</p>
            <el-switch/>
          </div>
        </div>
        <div class="panel">
          <div class="item">
            <p class="text-[18px]">媒体保存到本地磁盘</p>
            <el-switch />
          </div>
        </div>
      </div>
</template>

<script lang="ts">
import { SetupContext, ref } from "vue"

import { ObPlayer } from "ob-xw-common"
import { AngleOptions, SpeedOptions, cur_angle, cur_speed } from "./index"

import { ObButton } from "@/common/templates/index"
import { Camera } from '@/store/index'

export default {
  name: "SettingPanel",
  props: {
    isVideoMode: {
      type: Boolean
    },
    filters: {
        type: Array
    }
  },

  emits: ["close", "ChangeSpeed", "ToggleExtract"],
  components: { ObPlayer, ObButton },

  setup(props: any, context: SetupContext) {
    function close() {
      context.emit("close");
    }

    const enableExtract = ref(false);

    const currentFilter = ref({ shortName: '' })

    const currentFilterValue = ref(0)

    const slide = (v: any) => {
        currentFilterValue.value = v
        context.emit('changeFilterValue', v)
        // setFilter(currentFilterName.value, v)
    }

    function activeFilter(content: any){
        currentFilter.value = content;
        context.emit('changeFilter', content)
    }

    function ChangeAngle(value: any, speed: any){
        cur_angle.value = value;
        cur_speed.value = speed;
        context.emit("ChangeAngle", cur_angle.value, cur_speed.value);
    }
    
    function ChangeSpeed(value: any, angle: any){
        cur_speed.value = value;
        cur_angle.value = angle;
        context.emit("ChangeSpeed", cur_speed.value, cur_angle.value);
    }    

    function ToggleExtract(value: any){
      console.log("FFFFFFFFFF toggleExtract", value)
      context.emit("ToggleExtract", value);
    }

    function ToggleAutoFocus(value: any){
      console.log("FFFFFFFFFF toggle Autofocus", value)
      context.emit("ToggleAutoFocus", value);
    }

    return { slide, currentFilterValue, currentFilter, activeFilter, Camera, close, enableExtract, ToggleExtract, ToggleAutoFocus, AngleOptions, SpeedOptions, cur_angle, cur_speed, ChangeAngle, ChangeSpeed };
  },
};
</script>
<style lang="scss" scoped>
// .el-slider__button{
//     height: 10px !important;
//     width: 10px !important;
// }
@import "./local.scss";
.filter-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 每行 2 列 */
  gap: 10px; /* 元素之间的间距 */
}

.filter-item {
  height: 140px; /* 父容器固定高度 */
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
  display: flex; /* 使用 flex 居中内容 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  overflow: hidden; /* 隐藏溢出的部分 */

  img {
    max-width: 100%; /* 图片最大宽度为父容器宽度 */
    max-height: 120px; /* 图片最大高度为父容器高度 */
    object-fit: contain; /* 保持比例，完整显示图片 */
  }
}
</style>
