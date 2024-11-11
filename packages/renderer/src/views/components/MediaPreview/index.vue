<template>
    <div class="media-preview">
        <p class="font-bold">预览</p>
        <div class="media-container flex flex-col">
            <img v-if='!hasVideo' class="image" :src="data[0].url" @click="enlarge">
            <video v-else controls autoplay name="media" class="image">
                <source :src="data[0].url" type="video/mp4">
            </video>
        </div>
        <div class="screen-shot flex flex-row gap-x-1">
            <div v-for="(item, index) in data" :key="item.id" :class="['w-1/5', 'p-1', item.type == MediaType.IMAGE? '': 'hidden']">
                <img :src="item.url" class="w-full h-full border border-black rounded-md object-cover"/>
            </div>
        </div>

        <div class="flex flex-row h-10 px-10 mt-20">
            <el-button class="button flex-1" type="primary" @click="cancel">取消</el-button>
            <el-button class="button flex-1" type="primary" @click="confirm">保存到图库</el-button>
        </div>

        <el-dialog
            :model-value="fullscreen"
            :visible.sync="fullscreen"
            fullscreen="true"
            modal="true"
            append-to-body="true"
            :before-close="() => { fullscreen = false }"
            class="w-full h-full flex">
            <img v-if='!hasVideo' class="image w-full h-full" :src="data[0].url" @click="enlarge">
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { SetupContext, toRefs, watch, ref } from "vue"
import { findFilesWithExtensions, MediaMeta, MediaType } from './index'

export default {
    name: "MediaPreview",
    props: {
        source: {
            type: String
        },
        setting: {
            type: Object,
            default: () => ({
                bgRemoval: false,   // 抠图
                beauty: false       // 美颜
            })
        }
    },

    emits: ['cancel', 'confirm'],
    components: {  },

    setup(props: any, context: SetupContext) {

        const { source, setting } = toRefs(props)

        const data = ref<MediaMeta[]>([])
        const hasVideo = ref(false)
        const fullscreen = ref(false)

        function cancel(){
            context.emit('cancel')
        }

        function confirm(){
            context.emit('confirm')
        }

        function enlarge(){
            fullscreen.value = true
        }

        watch(source, (newSource) => {
            if(source.value){
                const result = findFilesWithExtensions(source.value, ['.png', '.mp4']);
                data.value = result.data;
                hasVideo.value = result.hasVideo;

                // TODO: 添加抠图逻辑
                if(setting.value.bgRemoval){
                    // ipcRenderer
                    // .invoke(ObEvent.IMAGE_SEGMENTAION, { filePath: data.value[0] })
                    // .then((url: string) => {
                    // imgSrc.value = url;
                    // });
                }
                // TODO：添加美颜逻辑
                if(setting.value.beauty){

                }
            }
        }, { immediate: true }); // immediate 为 true 时初始执行一次


        return {
            fullscreen,
            enlarge,
            cancel,
            confirm,
            data,
            hasVideo,
            MediaType
        };
    },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
</style>
