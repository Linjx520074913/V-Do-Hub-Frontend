<template>
    <div class="media-preview">
        <p class="font-bold">预览</p>
        <div class="media-container flex flex-col">
            <img v-if='!hasVideo' class="image" :src="data[0].url">
            <video v-else controls autoplay name="media" class="image">
                <source :src="data[0].url" type="video/mp4">
            </video>
        </div>
        <div class="screen-shot flex flex-row gap-x-1">
            <div v-for="(item, index) in data" :key="item.id" :class="['w-1/5', 'p-1', item.type =='image'? '': 'hidden']">
                <img :src="item.url" class="w-full h-full border border-black rounded-md object-cover" />
            </div>
        </div>

        <div class="flex flex-row h-10 px-10 mt-20">
            <el-button class="button flex-1" type="primary" @click="cancel">取消</el-button>
            <el-button class="button flex-1" type="primary" @click="confirm">保存到图库</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { SetupContext, ref, toRefs } from "vue"
import { findFilesWithExtensions } from './index'

export default {
    name: "MediaPreview",
    props: {
        source: {
            type: String
        }
    },

    emits: ['cancel', 'confirm'],
    components: {  },

    setup(props: any, context: SetupContext) {

        const { source } = toRefs(props);
        
        const { data, hasVideo } = findFilesWithExtensions(source.value, ['.png', '.mp4'])
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@", source.value, data)
        function cancel(){
            context.emit('cancel')
        }

        function confirm(){
            context.emit('confirm')
        }

        return {
            cancel,
            confirm,
            data,
            hasVideo
        };
    },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
</style>
