<template>
    <div class="media-preview" 
        v-loading.fullscreen.lock="loading"
        :element-loading-text="loadingText"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0.8, 0.8, 0.8, 0.8)">
        <p class="font-bold">预览</p>
        <div class="media-container flex flex-col">
            <img v-if='!hasVideo' class="image" alt="Image" :src="data[0].url">
            <video v-else controls autoplay name="media" class="image">
                <source :src="data[0].url" type="video/mp4">
            </video>
        </div>
        <div class="screen-shot flex flex-row gap-x-1">
            <div v-for="(item, index) in data" :class="['w-1/5', 'p-1', item.type == MediaType.IMAGE? '': 'hidden']" @click="enlarge(item)">
                <img :src="item.url" class="w-full h-full border border-black rounded-md object-cover"/>
            </div>
        </div>

        <div class="flex flex-row h-10 px-10 mt-20" v-if="showButton">
            <el-button class="button flex-1" type="primary" @click="cancel">取消</el-button>
            <el-button class="button flex-1" type="primary" @click="confirm">保存到图库</el-button>
        </div>

        <el-dialog
            :model-value="fullscreen"
            :visible.sync="fullscreen"
            :fullscreen="option.fullscreen"
            :modal="option.modal"
            :append-to-body="option.appendToBody"
            :before-close="() => { fullscreen = false }"
            class="w-full h-full flex">
            <img class="image w-full h-full" :src="(selectedItem as any).url">
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { SetupContext, toRefs, watch, ref, onActivated } from "vue"
import { findFilesWithExtensions, MediaMeta, MediaType } from './index'
import { ipcRenderer } from 'electron';
import { ObEvent } from "@common/";

export default {
    name: "MediaPreview",
    props: {
        source: {
            type: String
        },
        showButton:{
            type: Boolean
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

        const { source, setting, showButton } = toRefs(props)

        const data = ref<MediaMeta[]>([])
        const hasVideo = ref(false)
        const fullscreen = ref(false)

        const loadingText = ref('AI 抠图处理中,请耐心等待')

        const option = ref({
            modal: true,
            fullscreen: true,
            appendToBody: true
        })

        const loading = ref(true)

        const selectedItem = ref(null);

        function cancel(){
            context.emit('cancel')
        }

        function confirm(){
            context.emit('confirm')
        }

        function enlarge(item?: any){
            fullscreen.value = true;
            if(item){
                selectedItem.value = item;
            }
        }

        async function runSegmenationTask(filePath: string): Promise<string>{
            return new Promise((resolve, reject) => {
                ipcRenderer.invoke(ObEvent.IMAGE_SEGMENTAION, { filePath: filePath })
                            .then((url: string) => {
                                console.log("FFFFAFA", filePath)
                                setTimeout(() => {
                                    resolve(url)
                                }, 500)
                            
                })
                .catch((error) => {
                    reject(error)
                });
            })
        }
        

        watch(source, async(newSource) => {
            if(source.value){
                const result = findFilesWithExtensions(source.value, ['.png', '.mp4']);
                data.value = result.data
                hasVideo.value = result.hasVideo

                // // TODO: 添加抠图逻辑
                for(let i = 0; i < data.value.length; i++){
                    if(setting.value.bgRemoval && data.value[i].type == MediaType.IMAGE){
                        try{
                            await runSegmenationTask(data.value[i].url)
                        }catch(error){

                        }
                    }
                }

                data.value = findFilesWithExtensions(source.value, ['.png', '.mp4']).data
                loading.value = false
                
                if(setting.value.bgRemoval){
                    
                }
                // TODO：添加美颜逻辑
                if(setting.value.beauty){

                }
            }
        }, { immediate: true }); // immediate 为 true 时初始执行一次


        return {
            option,
            loading,
            loadingText,
            selectedItem,
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
