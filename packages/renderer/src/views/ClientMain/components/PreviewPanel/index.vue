<template>
  <div class="create">
    <teleport to=".home-page-root">
      <Camera
        v-if="isCameraVisible"
        @close="
          () => {
            isCameraVisible = false;
          }
        "
      />
    </teleport>

    <div class="workspace dashed-border">
      <div class="media-entry">
        <p>添加媒体</p>
        <span style="margin-bottom: 30px"
          >通过SwifCam添加媒体,或者将您的媒体拖放到此页面的任何地方</span
        >
        <ObButton
          text="通过 SwifCam 添加媒体"
          icon="icon-quit"
          class="media-btn"
          @click="AddMediaCamera"
        />
        <ObButton
          text="上传"
          icon="icon-help"
          class="media-btn"
          @click="UploadMedia"
        />
      </div>
    </div>
    <div class="tool flex-row">
      <div class="flex-column" style="margin-right: 50px">
        <div class="flex-row center">
          <el-badge :value="12" class="badge">
            <p>移除背景</p>
          </el-badge>
          <span class="icon-share1" />
        </div>
        <div>
          <img src="@/assets/images/remove.jpg" />
        </div>
      </div>
      <div class="flex-column" style="margin-right: 100px">
        <div class="flex-row center">
          <el-badge :value="12" class="badge">
            <p>创建模特照</p>
          </el-badge>
          <span class="icon-share1" />
        </div>
        <div>
          <img src="@/assets/images/remove.jpg" />
        </div>
      </div>
      <div class="flex-column">
        <div class="flex-row center">
          <el-badge :value="12" class="badge">
            <p>AI产品描述</p>
          </el-badge>
          <span class="icon-share1" />
        </div>
        <div>
          <img src="@/assets/images/ai.png" />
        </div>
      </div>
    </div>
    <div class="tutorial">
      <p>如何设置 SwifCam?</p>
      <img src="@/assets/images/swifcam.png" style="width:130px;height: 100px"/>
    </div>
  </div>
</template>

<script lang="ts">
import { SetupContext, onMounted, ref } from "vue"
import { ObButton } from "@/common/templates/index"
import Camera from "./Camera/index.vue"

export default {
  name: "Create",
  props: {},

  emits: [],
  components: { ObButton, Camera },

  setup(props: any, context: SetupContext) {
    const isCameraVisible = ref(false);

    const visible = ref(false);
    function AddMediaCamera() {
      isCameraVisible.value = true;
      console.log("AddMediaCamera");
      //   ipcRenderer.invoke("IMAGE_SEGMENTAION");
    }
    function UploadMedia() {
      console.log("UploadMedia");
    }
    return {
      AddMediaCamera,
      UploadMedia,
      visible,
      isCameraVisible,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
@import "../../local.scss";
</style>
