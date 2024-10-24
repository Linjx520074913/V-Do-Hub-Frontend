<template>
  <div class="floating-window-preview">
    <div class="preview">
      <div class="preview-panel">
        <div class="title">预览</div>
        <ObPlayer class="preview-image" v-if="isPhoto" ref="player" />
        <video v-else controls autoplay name="media" class="video">
          <source :src="videoPath" type="video/mp4">
        </video>
        <ObButton class="extract-btn" @click="ExtractForeground" text="抠图" />
        <img v-if="isPhoto"
          :src="imgSrc"
          style="border: 1px solid blue; width: 200px; height: 200px"
        />
        <div v-else class="screen-shot-container">
          <div class="screen-shot" v-for="image in data">
            <img :src="image" style="width:100%; height: 100%"/>
          </div>
        </div>
        
        <div class="btn-group">
          <el-button class="cancel" @click="Cancel">取消</el-button>
          <ObButton class="save" @click="Confirm" text="保存到图库" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { SetupContext, onMounted, ref, toRefs } from "vue";
import { Props } from "@/common/export/interface";
import { ObButton } from "@/common/templates/index";
import { ObPlayer } from "ob-xw-common";
import { Messenger } from "@/components/index";
import { ipcRenderer } from "electron";
import { ObEvent } from "@common/event/ob-event-bus";
import path from "path";
import fs from "fs";

export default {
  name: "Preview",
  props: {
    data:{
      type: Array
    },
    isPhoto:{
      type: Boolean
    },
    videoPath:{
      type: String
    },
    autoExtract:{
      type: Boolean
    }
  },
  components: { ObButton, ObPlayer },

  emits: ["close"],

  setup(props: Props<any>, context: SetupContext) {
    const player = ref(null);
    const { data, isPhoto, videoPath, autoExtract } = toRefs(props);
    console.log("!!!!!!!!!!!!!!!!!!!!!!", videoPath);

    const imgSrc = ref("");
    // isPhoto.value = (filePath.value as string).includes('.png');
    // console.log("###########", filePath, isPhoto.value);

    function Cancel() {
      // 取消则删除文件夹及文件
      // const dir = path.dirname(filePath.value);
      // try{
      //   fs.rm(dir, { recursive: true, force: true }, (err) => {
      //     if (err) {
      //         console.error("Failed to delete folder:", err);
      //     } else {
      //         console.log("Folder deleted successfully!");
      //     }
      // });
      // }catch(error){

      // }
      context.emit("close");
    }

    function Confirm(){
      context.emit("close");
    }

    function ExtractForeground() {
      ipcRenderer
        .invoke(ObEvent.IMAGE_SEGMENTAION, { filePath: data.value[0] })
        .then((url: string) => {
          imgSrc.value = url;
        });
    }

    onMounted(() => {
      setTimeout(() => {
        Messenger.methods.publish("get-photo", {}, () => {
          Messenger.methods.getImage(1, 2, (info: any, data: Uint8Array) => {
            if(player && player.value){
              (player.value as any).render(
              data,
              info.width,
              info.height,
              info.format
            );
            }
          });
        });
        if(autoExtract.value){
          ExtractForeground();
        }
      }, 1000);
    });

    return { imgSrc, Cancel, Confirm, player, ExtractForeground };
  },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
</style>
