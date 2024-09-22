<template>
  <div class="floating-window-preview">
    <div class="preview">
      <div class="preview-panel">
        <p>预览</p>
        <ObPlayer class="preview-image" ref="player" />
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

    onMounted(() => {
      Messenger.methods.publish("take-photo", {});

      setTimeout(() => {
        console.log("GGGGGGGGGGG");
        Messenger.methods.publish("get-photo", {}, () => {
          console.log("FFFFFFFFFFFFFFFf get-photo");
          Messenger.methods.getImage(1, 2, (info: any, data: Uint8Array) => {
            console.log("FFFFFFFFFFFFFFFfaaaaaa");
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

    return { close, player };
  },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
</style>
