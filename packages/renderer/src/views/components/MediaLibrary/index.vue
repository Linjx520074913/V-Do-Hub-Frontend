<template>
    <div class="flex flex-col h-full bg-[#F1F1F1]">
        <!-- 图片展示 -->
        <div class="grid grid-rows-3 grid-cols-5 gap-x-4 gap-y-6 p-4 w-full flex-1">
            <MediaCard v-for="(item, index) in data"
                :data="item"
                @click="showPreview"
            />
        </div>
        <!-- 预览 -->
        <el-drawer
            class="drawer"
            :with-header="false"
            :model-value="source != ''"
            :before-close="() => { source = '' }">
            <MediaPreview
                :showButton="false"
                :source="source"
                @cancel="() => { source = '' }"
                @confirm="() => { source = '' }"
            />
        </el-drawer>
        <!-- 上一页 下一页 -->
        <div class='flex w-full h-[35px] items-center'>
            <p class="text-[18px] ml-[30px]">{{ totalCount }} 总计项目</p>
            <el-pagination
                class="mt-auto mb-[15px] ml-auto mr-10"
                @current-change="activePage"
                :current-page.sync="currentPageIndex"
                :page-size="pageSize"
                layout="prev, pager, next"
                prev-text="< 上一页"
                next-text="下一页 >"
                :total="totalCount">
            </el-pagination>
        </div>
    </div>
</template>

<script lang="ts">
import { SetupContext, ref, watch } from "vue"
import { ObTab } from "@/common/templates/index"

import { Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'

import { Gallery } from '@/store/index'
import MediaPreview from '../MediaPreview/index.vue'

import MediaCard from './MediaCard/index.vue'

export default {
    name: "MediaLibrary",
    props: {},

    emits: [],
    components: { ObTab, Waterfall, MediaPreview, MediaCard },

    setup(props: any, context: SetupContext) {
        
        const data = ref([])

        const source = ref('')

        function handleClick(item: any){
            source.value = item.url
        }

        function showPreview(item: any){
            source.value = item.filePath
        }

        const root = "D://data";

        const totalCount = ref(0)
        const pageSize = ref(15)
        const currentPageIndex = ref(-1)

        const Options = [
            { title: '全部',   component: '', id: 0 },
            { title: '图片',   component: '', id: 1 },
            { title: '视频',   component: '', id: 2 }
        ]

        function activePage(index: number){
            currentPageIndex.value = index
        }

        const isInit = ref(false)

        // TODO: 这个地方可以优化，可以把耗时的操作放到 webworker 中执行
        Gallery.methods.findFilesWithExts(root, ['.png', '.mp4']).then((files: any) => {
            isInit.value = true
            currentPageIndex.value = 1
            totalCount.value = Gallery.methods.getTotalCount()
        })

        watch( currentPageIndex, (newValue: any, oldValue: any) => {
            if(isInit.value){
                data.value = Gallery.methods.fetchFilesByPage(currentPageIndex.value, pageSize.value) as any
            }
        }, { immediate: true })

        return { showPreview, activePage, data, source, Options, handleClick, pageSize, totalCount, currentPageIndex };
    }
};
</script>
<style lang="scss" scoped>
.item {
    width: 200px; /* 固定宽度 */
    height: 200px; /* 固定高度 */
    overflow: hidden; /* 溢出部分隐藏 */
}

.item img {
    width: 100%;
    height: 100%; /* 保持图片填满容器 */
    object-fit: cover; /* 使图片适应容器而不失真 */
    border-radius: 8px; /* 图片圆角 */
}
@import "./local.scss";
</style>
