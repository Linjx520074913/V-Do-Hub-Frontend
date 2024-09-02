<template>
	<div class="w-full flex flex-col text-white" style="background:#1E1E1E">
		<div id="log-resize" />
		<div :class="{'div-hide': !log.isShow}" id="log-main" class='flex flex-col'>
			<!-- <div class="flex flex-row w-full p-2 text-md  bg-blue-500 border-b border-gray-700">
				<p class="w-24">等级</p>
				<p class="w-48 mr-8">时间戳</p>
				<p class="flex-1">信息</p>
				<n-popover trigger="hover" :delay="1000" :duration="5">
					<template #trigger>
						<span :class="['mt-auto mb-auto text-xl ml-1 text-gray-500 active:text-gray-500 hover:text-blue-400 hover:cursor-pointer','icon-orbbec']"
							@click="log.startGenerate"/>
					</template>
					<span v-if="log.isTimerOn">停止生成随机日志</span>
					<span v-else>开始生成随机日志</span>
				</n-popover>
				<n-popover trigger="hover" :delay="1000" :duration="5">
					<template #trigger>
						<span class="icon-orbbec mt-auto mb-auto text-xl ml-1 text-gray-500 active:text-gray-500 hover:text-blue-400 hover:cursor-pointer"
							@click="log.clean"/>
					</template>
					<span>清空日志</span>
				</n-popover>
			</div> -->

			<div class="flex flex-row w-full p-2 text-md justify-center align-center">
				<el-button class="collapse-button" @click="log.show">
					<span class="icon-point-down" />
				</el-button>
				<!-- <n-popover trigger="hover" :delay="1000" :duration="5">
					<template #trigger>
						<span :class="['mt-auto mb-auto text-xl ml-1 text-gray-500 active:text-gray-500 hover:text-blue-400 hover:cursor-pointer','icon-orbbec']"
							@click="log.startGenerate"/>
					</template>
					<span v-if="log.isTimerOn">停止生成随机日志</span>
					<span v-else>开始生成随机日志</span>
				</n-popover>
				<n-popover trigger="hover" :delay="1000" :duration="5">
					<template #trigger>
						<span class="icon-orbbec mt-auto mb-auto text-xl ml-1 text-gray-500 active:text-gray-500 hover:text-blue-400 hover:cursor-pointer"
							@click="log.clean"/>
					</template>
					<span>清空日志</span>
				</n-popover> -->
			</div>
			<VirtualList
				class="overflow-y-scroll px-2 flex-1"
				ref="vsl"
				:data-key="'index'"
				:data-sources="log.buffer"
				:data-component="LogItem"
				:estimate-size="70"
				:keeps="30"
			>
			</VirtualList>
		</div>
		<!-- <div class="flex flex-row w-full p-1 text-md">
			<n-popover trigger="hover" :delay="1000" :duration="5">
				<template #trigger>
					<span :class="['mt-auto mb-auto text-xl ml-1 text-gray-500 active:text-gray-500 hover:text-blue-400 hover:cursor-pointer', {'icon-move-down': log.isShow}, {'icon-move-up': !log.isShow}]"
						@click="log.show"/>
				</template>
				<span v-if="!log.isShow"> 显示日志 </span>
				<span v-else="log.isShow"> 隐藏日志 </span>
			</n-popover>
			<div class="relative mt-1 rounded-md shadow-sm text-blue-500 ml-auto mr-2">
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
					<span class="icon-search"/>
				</div>
				<input type="text" class="w-56 rounded-md focus:outline-none focus:border-indigo-500 pl-9 pr-12 pt-1 pb-1 disabled:cursor-not-allowed" placeholder="Search"  disabled>
			</div>
			<n-popover trigger="hover" :delay="1000" :duration="5">
				<template #trigger>
					<span :class="['mt-auto mb-auto text-xl ml-1 text-gray-500 active:text-gray-500 hover:text-blue-400 hover:cursor-pointer', {'icon-play3':!log.isTimerOn, 'icon-pause2': log.isTimerOn}]"
						@click="log.startGenerate"/>
				</template>
				<span v-if="log.isTimerOn">停止生成随机日志</span>
				<span v-else>开始生成随机日志</span>
			</n-popover>
			<n-popover trigger="hover" :delay="1000" :duration="5">
				<template #trigger>
					<span class="icon-bin2 mt-auto mb-auto text-xl ml-1 text-gray-500 active:text-gray-500 hover:text-blue-400 hover:cursor-pointer"
						@click="log.clean"/>
				</template>
				<span>清空日志</span>
			</n-popover>
			<n-popover trigger="hover" :delay="1000" :duration="5">
				<template #trigger>
					<span class="icon-download mt-auto mb-auto text-xl ml-1 text-gray-500 active:text-gray-500 hover:text-blue-400 hover:cursor-not-allowed" disabled
						@click="save"/>
				</template>
				<span>保存日志</span>
			</n-popover>
		</div> -->
		
	</div>
</template>

<script>
import VirtualList from 'vue3-virtual-scroll-list';
import LogItem from "./item.vue";
import { log, vsl, init } from "./index";

export default {
    name: "LogViewer",
	components:{ VirtualList },
    props:{
        source: {
			type: Object,
			default: () => ({}),
      	},
    },
    setup(){
		
		init();
		return { log, vsl, LogItem };	
	
	}
}
</script>
	
<style lang="scss" scoped>
@import "./index.scss";
// @import "@/common/styles/elementPlusDefault.scss";
</style>
	