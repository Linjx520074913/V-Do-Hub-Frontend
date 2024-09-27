<template>
  <div class="floating-window-preview">
    <div class="preview">
      <div class="preview-panel">
        <p>预览</p>
        <ObPlayer class="preview-image" ref="player" />
        <ObButton class="extract-btn" @click="ExtractForeground" text="抠图" />
        <img
          :src="img"
          style="border: 1px solid blue; width: 200px; height: 200px"
        />
        <div class="btn-group">
          <el-button class="cancel" @click="close">取消</el-button>
          <ObButton class="save" @click="close" text="保存到图库" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { SetupContext, onMounted, ref } from "vue";
import { Props } from "@/common/export/interface";
import { ObButton } from "@/common/templates/index";
import { ObPlayer } from "ob-xw-common";
import { Messenger } from "@/components/index";
import { ipcRenderer } from "electron";
import { ObEvent } from "@common/event/ob-event-bus";
import { newModelMaterial } from "@/common/templates/ob-scan-worker/src/shader/materials";

export default {
  name: "Preview",
  props: {},
  components: { ObButton, ObPlayer },

  emits: ["close"],

  setup(props: Props<any>, context: SetupContext) {
    const player = ref(null);
    function close() {
      context.emit("close");
    }

    const img = ref("");
    const filePath = ref("");

    function ExtractForeground() {
      ipcRenderer
        .invoke(ObEvent.IMAGE_SEGMENTAION, { filePath: filePath.value })
        .then((url: string) => {
          img.value = url;
          console.log("@@@@@@@@@@@@", url);
        });
    }

    onMounted(() => {
      // 获取当前日期
      const now = new Date();

      // 格式化日期为 "YYYY-MM-DD" 格式
      const formattedDateTime = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}_${String(
        now.getHours()
      ).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}-${String(
        now.getSeconds()
      ).padStart(2, "0")}`;

      // 构建文件路径
      filePath.value = "D://Data//" + formattedDateTime + ".png";

      Messenger.methods.publish("take-photo", {
        filePath: filePath.value,
      });

      setTimeout(() => {
        Messenger.methods.publish("get-photo", {}, () => {
          Messenger.methods.getImage(1, 2, (info: any, data: Uint8Array) => {
            (player.value as any).render(
              data,
              info.width,
              info.height,
              info.format
            );
          });
        });
      }, 1000);
    });

    return { close, player, ExtractForeground, img };
  },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
</style>
