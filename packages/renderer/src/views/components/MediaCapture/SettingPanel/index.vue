<template>
  <div class="camera-setting overflow-y-scroll">
        <div class="panel">
          <div class="item">
            <p>设备</p>
            <p>Test</p>
          </div>
          <div class="divider" />
          <div v-if="isVideoMode">
            <div class="item">
              <p>转盘角度设置</p>
            </div>
            <div class="menu">
                <div :class="['menu-item', angle == cur_angle? 'menu-item-highlight': '']" v-for="angle in AngleOptions" @click="ChangeAngle(angle)">
                {{ angle }}
              </div>
            </div>
            <div class="panel">
              <div class="item">
                <p>转盘速度设置</p>
              </div>
              <div class="menu">
                <div :class="['menu-item', speed.text == cur_speed.text? 'menu-item-highlight': '']" v-for="speed in SpeedOptions" @click="ChangeSpeed(speed)">
                {{ speed.text }}
              </div>
            </div>
            </div>
          </div>
          
        </div>
        <div class="panel">
          <div class="item">
            <p>GemAI</p>
          </div>
          <el-checkbox class="extractor" @change="ToggleExtract" v-model="enableExtract">AI 抠图</el-checkbox>
          <el-checkbox class="beautifier" disabled>AI 磨皮</el-checkbox>
          <el-checkbox class="beautifier" disabled>AI 去尘</el-checkbox>
        </div>
        <div class="panel">
            <div class="item">
                <p>滤镜</p>
            </div>
            <el-checkbox class="extractor" disabled>黄金</el-checkbox>
            <el-checkbox class="extractor" disabled>K金</el-checkbox>
            <el-checkbox class="extractor" disabled>银饰</el-checkbox>
            <el-checkbox class="extractor" disabled>翡翠</el-checkbox>
        </div>
        <div class="panel">
            <div class="item">
                <p>调整</p>
            </div>
            <div class="flex flex-col w-5/6">
                <span>亮度  :   {{ Camera.data.brightness }}</span>
                <el-slider v-model="Camera.data.brightness" @change="Camera.methods.setBrightness"></el-slider>
            </div>
            <div class="flex flex-col w-5/6">
                <span>色调  :   {{ Camera.data.hue }}</span>
                <el-slider v-model="Camera.data.hue" @change="Camera.methods.setHue"></el-slider>
            </div>
            <div class="flex flex-col w-5/6">
                <span>饱和度  :   {{ Camera.data.saturation }}</span>
                <el-slider v-model="Camera.data.saturation" @change="Camera.methods.setSaturation"></el-slider>
            </div>
            <div class="flex flex-col w-5/6">
                <span>锐度  :   {{ Camera.data.sharpness }}</span>
                <el-slider v-model="Camera.data.sharpness" @change="Camera.methods.setSharpness"></el-slider>
            </div>
            <div class="flex flex-col w-5/6">
                <span>对比度  :   {{ Camera.data.contrast }}</span>
                <el-slider v-model="Camera.data.contrast" @change="Camera.methods.setContrast"></el-slider>
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
            <el-switch/>
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
</template>

<script lang="ts">
import { SetupContext, ref } from "vue"

import { ObPlayer } from "ob-xw-common"
import { AngleOptions, SpeedOptions, cur_angle, cur_speed, ChangeAngle } from "./index"

import { ObButton } from "@/common/templates/index"
import { Camera } from '@/store/index'

export default {
  name: "SettingPanel",
  props: {
    isVideoMode: {
      type: Boolean
    }
  },

  emits: ["close", "ChangeSpeed"],
  components: { ObPlayer, ObButton },

  setup(props: any, context: SetupContext) {
    function close() {
      context.emit("close");
    }

    const enableExtract = ref(false);

    function ChangeSpeed(value: any){
        cur_speed.value = value;
        context.emit("ChangeSpeed", cur_speed.value);
    }

    function ToggleExtract(value: any){
      console.log("FFFFFFFFFF toggleExtract", value)
      context.emit("ToggleExtract", value);
    }

    return { Camera, close, enableExtract, ToggleExtract, AngleOptions, SpeedOptions, cur_angle, cur_speed, ChangeAngle, ChangeSpeed };
  },
};
</script>
<style lang="scss" scoped>
// .el-slider__button{
//     height: 10px !important;
//     width: 10px !important;
// }
::v-deep .el-slider__button{
    width: 10px !important;
    height: 10px !important
}
@import "./local.scss";
</style>
