<template>
    <div class="create">
        <teleport to=".home-page-root">
            <Camera
                v-if="isCameraVisible"
                @close="() => { isCameraVisible = false }
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
                    @click="StartCapture"
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
            <img src="@/assets/images/swifcam.png" style="width:130px;height: 100px" @click="showTutorial"/>
        </div>
        <el-dialog
            :model-value="showVideo"
            :visible.sync="showVideo"
            modal="true"
            append-to-body="true"
            :before-close="() => { showVideo = false }"
            class="w-1/2 h-1/2 flex">
            <video v-if="showVideo" controls autoplay name="media" class="image mt-4">
                <source :src="videoURL" type="video/mp4">
            </video>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { SetupContext, ref } from "vue"
import { ObButton } from "@/common/templates/index"
import Camera from "./Camera/index.vue"

export default {
    name: "CameraCapture",
    props: {},

    emits: [],
    components: { ObButton, Camera },

    setup(props: any, context: SetupContext) {
        const isCameraVisible = ref(false);
        const showVideo = ref(false)
        const videoURL = ref('F://test.mp4')

        function StartCapture() {
            isCameraVisible.value = true;
        }
        function UploadMedia() {
            console.log("UploadMedia")
        }
        function showTutorial(){
            showVideo.value = true
        }
        return {
            videoURL,
            showVideo,
            showTutorial,
            StartCapture,
            UploadMedia,
            isCameraVisible,
        };
    },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
@import "../../local.scss";
</style>
