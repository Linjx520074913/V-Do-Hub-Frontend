<template>
    <div class="w-[278] h-[278] border bg-white flex flex-col p-1 shadow border-[#A7A7A7] hover:border-main-color cursor-pointer">
        <img class="w-[200px] aspect-ratio-[1/1] ml-auto mr-auto rounded-sm" :src="data.thumbnail" loading="lazy" @click="handleClick"/>
        <p class="ml-[15px] text-[14px] text-[#6A6A6A] mt-auto mb-auto">{{ data.fileName }}</p>
        <p class="ml-[15px] text-[14px] text-[#6A6A6A] mt-auto mb-auto">{{ data.time }}</p>
    </div>
</template>

<script lang="ts">
import { SetupContext, toRefs } from "vue"

export default {
    name: "MediaCard",
    props: {
        data:{
            type: Object
        }
    },

    emits: [ 'click' ],
    components: {},

    setup(props: any, context: SetupContext) {
        const { data } = toRefs(props)

        function handleClick(){
            context.emit('click', data.value)
        }

        // TODO: 根据图片分辨率自适应图片比例
        return { data, handleClick }
    },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
</style>
