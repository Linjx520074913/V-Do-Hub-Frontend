<template>
  <div class="floating-window-preview">
    <img v-if="enlarge" :src="info.screenShot" class="enlarge"  @click="EnlargeImage(false)"/>
    <div v-else class="preview">
        <div class="title">详情</div>
        <div class="container">
          <img :src="info.screenShot" v-if="info.type == 'image'" @click="EnlargeImage(true)">
          <video v-else controls autoplay name="media" class="video">
            <source :src="video" type="video/mp4">
        </video>
        </div>
        <div class="btn-group">
          <el-button class="cancel" @click="Close">关闭</el-button>
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

export default {
  name: "Preview",
  props: {
    info:{
      type: Object
    }
  },
  components: { ObButton, ObPlayer },

  emits: ["close"],

  setup(props: Props<any>, context: SetupContext) {
    const { info } = toRefs(props);
    const enlarge = ref(false);
    console.log("############", info.value.type);

    function EnlargeImage(value: boolean){
      enlarge.value = value;
    }

    function Close(){
      context.emit("close");
    }

    // const video = ref('https://media.w3.org/2010/05/sintel/trailer.mp4');
    const video = ref(info.value.video);

    return { enlarge, EnlargeImage, Close, video };
  },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
</style>
