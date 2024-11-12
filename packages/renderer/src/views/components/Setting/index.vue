<template>
    <div>
		<video-player ref="videoPlayerRef" :src="videoSrc" :poster="poster" :options="playerOptions" :autoplay="false" />
		<br />
		<br />

		<el-button plain @click="dialogVisible = true"> 打开视频 </el-button>
		<el-dialog v-model="dialogVisible" :title="title" width="800px" :before-close="handleClose">
			<video-player ref="videoPlayerRef" :src="videoSrc" :poster="poster" :options="playerOptions" :autoplay="false" />
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import path from "path";
import { ref } from "vue";

//视频播放器
const videoPlayerRef = ref();

const dialogVisible = ref(false);

// 视频标题
const title = ref("");
title.value = "小学生写作业";
//视频封面
const poster = ref("http://115.29.200.134:9005/tiku-resources/video/knowledge/p/3.jpg");
// 视频链接地址
const videoSrc = ref(path.join(process.resourcesPath, 'extraResources', 'asset', 'tutorial.mp4'))

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

const handleClose = () => {
	dialogVisible.value = false;
};
</script>
<style scoped>
:deep(.el-dialog__body) {
	padding: 0;
}
</style>