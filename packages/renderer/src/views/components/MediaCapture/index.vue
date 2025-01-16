<template>
    <div class="create px-5">
        <teleport to=".home-page-root">
            <Camera
                v-if="showCamera"
                @close="() => { showCamera = false }
                "
            />
        </teleport>

        <div class="border-2 border-dashed border-black flex flex-col justify-center items-center bg-white h-[329px]">
            <div class="media-entry">
                <p class="mb-8 text-[30px]">添加产品</p>
                <div
                    class="mb-5 w-[282px] h-[56px] rounded-full bg-main-color flex justify-center items-center text-white cursor-pointer"
                    @click="StartCapture"
                >
                    通过 SwifCam 添加产品
                </div>
                <div
                    class="w-[282px] h-[56px] rounded-full bg-main-color flex justify-center items-center text-white cursor-pointer"
                    @click="UploadMedia"
                >
                本地上传产品图片或视频
                </div>
            </div>
        </div>
        <div class="mt-[24px] flex flex-col justify-center items-center">
            <p class="text-[25px] mt-4 mb-2">工具箱</p>
            <div class="flex flex-row w-full h-[305px] space-x-2">
                <div class="flex flex-col justify-end items-center tool-0 p-4 cursor-pointer text-center" @click="activeAIRemove">
                    <p class="mb-2 text-[20px]">AI智能抠图</p>
                    <p class="mb-2">智能AI精准识别需要保留的主体并移除多余背景，高效完成在线抠图任务</p>
                </div>
                <div class="flex flex-col justify-end items-center tool-1 p-4 cursor-pointer text-center" @click="activeAIScene">
                    <p class="mb-2 text-[20px]">AI场景生成</p>
                    <p class="mb-2">智能识别图片主体，并根据风格模板或场景提示词自动生成背景，打造精美产品图</p>
                </div>
                <div class="flex flex-col justify-end items-center tool-2 p-4 cursor-pointer text-center" @click="activeAIBeauty">
                    <p class="mb-2 text-[20px]">AI图片美化</p>
                    <p class="mb-2">一键上传图片，AI照片修复技术能够巧妙重塑图像细节，轻松让图片变精美</p>
                </div>
            </div>
        </div>
        <div class="mt-[46px] flex flex-col justify-center items-center">
            <p class="text-[25px] mt-2 mb-4">教程</p>
            <div class="flex flex-row space-x-4 w-full h-[60px]">
                <div class="bg-white rounded-md flex-1 h-full flex flex-row items-center p-2 cursor-pointer" @click="playTutorialVideo">
                    <img src="@/assets/images/Swifaigo/play.png">
                    <p class="text-[20px] ml-4">如何连接整套系统?</p>
                </div>
                <div class="bg-white rounded-md flex-1 h-full flex flex-row items-center p-2 cursor-pointer" @click="playTutorialVideo">
                    <img src="@/assets/images/Swifaigo/play.png">
                    <p class="text-[20px] ml-4">Hub 内软件如何使用?</p>
                </div>
            </div>
        </div>
        <el-dialog v-model="showTutorial" title="使用教程" width="800px" :before-close="() => { showTutorial = false }">
			<video-player ref="videoPlayerRef" :src="videoURL"  :options="playerOptions" :autoplay="false" />
		</el-dialog>
    </div>
</template>

<script lang="ts">
import { SetupContext, ref } from "vue"
import { ObButton } from "@/common/templates/index"
import Camera from "./Camera/index.vue"
import path from 'path'
import { Menu, Account } from '@/store/index'
import { ElMessage } from 'element-plus'

export default {
    name: "MediaCapture",
    props: {},

    emits: [],
    components: { ObButton, Camera },

    setup(props: any, context: SetupContext) {
        const showCamera  = ref(false);
        const showTutorial = ref(false)
        const videoURL = ref(path.join(process.resourcesPath, 'extraResources', 'asset', 'tutorial.mp4'))
        const modal = ref(true)
        const appendToBody = ref(true)

        function activeAIRemove(){
            ElMessage({
                message: '暂未开放',
                type: 'error'
            })
        }

        function activeAIBeauty(){
            ElMessage({
                message: '暂未开放',
                type: 'error'
            })
        }

        function activeAIScene(){
            // 检查是否有会员
            if(!Account.data.curUser.membership.isMember){
                ElMessage({
                    message: '请开通会员',
                    type: 'error'
                })
            }else{
                Menu.methods.activeIndex(5)
            }
        }

        function StartCapture() {
            console.log('StartCapture')
            showCamera.value = true;
        }
        function UploadMedia() {
            // router.push(RouterPath.MEDIA_LIBRARY)
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
            appendToBody,
            modal,
            poster,
            playerOptions,
            videoURL,
            showTutorial,
            playTutorialVideo,
            StartCapture,
            UploadMedia,
            showCamera,
            Menu,
            activeAIScene,
            activeAIRemove,
            activeAIBeauty
        };
    },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
@import "../../local.scss";

.tool-0{
    width: 450px;
    background: url('@/assets/images/Swifaigo/tool_0.png');
    object-fit: cover;
}

.tool-1{
    width: 450px;
    background: url('@/assets/images/Swifaigo/tool_1.png');
    object-fit: cover;
}

.tool-2{
    width: 450px;
    background: url('@/assets/images/Swifaigo/tool_2.png');
}
</style>
