<template>
    <div class="create">
        <teleport to=".home-page-root">
            <Camera
                v-if="showCapture"
                @close="() => { showCapture = false }
                "
            />
        </teleport>

        <div class="workspace dashed-border">
            <div class="media-entry">
                <p>添加媒体</p>
                <span style="margin-bottom: 30px">
                    通过SwifCam添加媒体,或者将您的媒体拖放到此页面的任何地方
                </span>
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
            <img src="@/assets/images/swifcam.png" style="width:130px;height: 100px" @click="playTutorialVideo"/>
        </div>
        <el-dialog
            :model-value="showTutorial"
            :visible.sync="showTutorial"
            modal="true"
            append-to-body="true"
            :before-close="() => { showTutorial = false }"
            class="w-1/2 h-1/2 flex">
            <video-player ref="videoPlayerRef" :src="videoURL" :poster="poster" :options="playerOptions" :autoplay="false" />
            <!-- <video v-if="showTutorial" controls autoplay name="media" class="image mt-4 w-full h-full">
                <source :src="videoURL" type="video/mp4">
            </video> -->
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { SetupContext, ref } from "vue"
import { ObButton } from "@/common/templates/index"
import Camera from "./Camera/index.vue"
import path from 'path';

export default {
    name: "CameraCapture",
    props: {},

    emits: [],
    components: { ObButton, Camera },

    setup(props: any, context: SetupContext) {
        const showCapture  = ref(false);
        const showTutorial = ref(false)
        const videoURL = ref(path.join(process.resourcesPath, 'extraResources', 'asset', 'tutorial.mp4'))

        function StartCapture() {
            showCapture.value = true;
        }
        function UploadMedia() {
            console.log("UploadMedia")
        }
        function playTutorialVideo(){
            showTutorial.value = true
        }

        const poster = ref("https://image.baidu.com/search/detail?ct=503316480&z=0&ipn=false&word=%E5%A3%81%E7%BA%B8&step_word=&hs=0&pn=7&spn=0&di=7412302663070515201&pi=0&rn=1&tn=baiduimagedetail&is=0%2C0&istype=2&ie=utf-8&oe=utf-8&in=&cl=2&lm=-1&st=-1&cs=1279911946%2C1587331600&os=2892036643%2C3653892&simid=3352968003%2C284305033&adpicid=0&lpn=0&ln=1841&fr=&fmq=1526269427171_R&fm=&ic=0&s=undefined&hd=undefined&latest=undefined&copyright=undefined&se=&sme=&tab=0&width=&height=&face=undefined&ist=&jit=&cg=wallpaper&bdtype=0&oriquery=&objurl=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F5%2F526a5d3bbb13a.jpg&fromurl=ippr_z2C%24qAzdH3FAzdH3Fooo_z%26e3Botg9aaa_z%26e3Bv54AzdH3Fowssrwrj6_1jpwts_9da0d_8d_z%26e3Bip4s&gsm=1e&rpstart=0&rpnum=0&islist=&querylist=&nojc=undefined&lid=8921033772184611681");
        // 视频播放器配置
        let playerOptions = ref({
            // height: 200,
            // width: document.documentElement.clientWidth, //播放器宽度
            playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
            muted: false, // 默认情况下将会消除任何音频。
            loop: false, // 导致视频一结束就重新开始。
            preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
            language: "zh-CN",
            aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
            fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
            notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
            controls: true,
            controlBar: {
                timeDivider: true,
                durationDisplay: true,
                remainingTimeDisplay: false,
                fullscreenToggle: true // 全屏按钮
            }
        });

        return {
            poster,
            playerOptions,
            videoURL,
            showTutorial,
            playTutorialVideo,
            StartCapture,
            UploadMedia,
            showCapture,
        };
    },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
@import "../../local.scss";
</style>
