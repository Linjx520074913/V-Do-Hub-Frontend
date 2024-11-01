<template>
  <div class="gallery-root">
   <ObTab :options="Options"/>
   <div>
    <Waterfall
      :list="images"
      :row-key="options.rowKey"
      :gutter="options.gutter"
      :has-around-gutter="options.hasAroundGutter"
      :width="options.width"
      :breakpoints="options.breakpoints"
      :img-selector="options.imgSelector"
      :background-color="options.backgroundColor"
      :animation-effect="options.animationEffect"
      :animation-duration="options.animationDuration"
      :animation-delay="options.animationDelay"
      :animation-cancel="options.animationCancel"
      :lazyload="options.lazyload"
      :load-props="options.loadProps"
      :align="options.align"
    >
      <template #default="{ item }">
        <div class="item" @click="handleClick(item)">
          <img :src="item.screenShot" />
          <div class="divider" />
          <div class="information">
            <p>{{ item.name }}</p>
          </div>
        </div>
      </template>
    </Waterfall>
   </div>
   <teleport to=".home-page-root">
    <Preview
      v-if="showPreview"
      :info="selectedItem"
      @close="
        () => {
          showPreview = false;
        }
      "
    />
  </teleport>
  </div>
</template>

<script lang="ts">
import { SetupContext, onMounted, ref, reactive } from "vue"
import { ObTab } from "@/common/templates/index"
import { Options } from "./index"

import { Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
import path from "path"
import fs from "fs"

import Preview from "./Preview/index.vue"

export default {
  name: "Gallery",
  props: {},

  emits: [],
  components: { ObTab, Waterfall, Preview },

  setup(props: any, context: SetupContext) {
    const centerDialogVisible = ref(false);
    function click() {
      centerDialogVisible.value = true;
    }
    const options = reactive({
      // 唯一key值
      rowKey: 'id',
      // 卡片之间的间隙
      gutter: 10,
      // 是否有周围的gutter
      hasAroundGutter: true,
      // 卡片在PC上的宽度
      width: 200,
      // 自定义行显示个数，主要用于对移动端的适配
      breakpoints: {
        1200: {
          // 当屏幕宽度小于等于1200
          rowPerView: 4,
        },
        800: {
          // 当屏幕宽度小于等于800
          rowPerView: 3,
        },
        500: {
          // 当屏幕宽度小于等于500
          rowPerView: 2,
        },
      },
      // 动画效果
      animationEffect: 'animate__fadeInUp',
      // 动画时间
      animationDuration: 1000,
      // 动画延迟
      animationDelay: 300,
      animationCancel: false,
      // 背景色
      backgroundColor: '#FAFAFB',
      // imgSelector
      imgSelector: 'src.original',
      // 加载配置
      loadProps: {
        ratioCalculator: (width: number, height: number) => {
          // 我设置了最小宽高比
          const minRatio = 3 / 4
          const maxRatio = 4 / 3
          return Math.random() > 0.5 ? minRatio : maxRatio
        },
      },
      // 是否懒加载
      lazyload: true,
      align: 'center',
    })
    // const images = [
    //     { name: '1', src: 'https://cdn.shopify.com/s/files/1/2418/2505/files/MN1091-CIN2803-DEF.webp?v=1728035904', alt: 'Image 1' },
    //     { name: '1', src: 'https://cdn.shopify.com/s/files/1/2418/2505/files/MN1091-CIN2803-DEF.webp?v=1728035904', alt: 'Image 2' },
    //     { name: '1', src: 'https://cdn.shopify.com/s/files/1/2418/2505/files/MN1091-CIN2803-DEF.webp?v=1728035904', alt: 'Image 3' },
    //     { name: '1', src: 'https://cdn.shopify.com/s/files/1/2418/2505/files/MN1091-CIN2803-DEF.webp?v=1728035904', alt: 'Image 1' },
    //     { name: '1', src: 'https://cdn.shopify.com/s/files/1/2418/2505/files/MN1091-CIN2803-DEF.webp?v=1728035904', alt: 'Image 2' },
    //     { name: '1', src: 'https://cdn.shopify.com/s/files/1/2418/2505/files/MN1091-CIN2803-DEF.webp?v=1728035904', alt: 'Image 3' },
    //     { name: '1', src: 'https://cdn.shopify.com/s/files/1/2418/2505/files/MN1091-CIN2803-DEF.webp?v=1728035904', alt: 'Image 1' },
    //     { name: '1', src: 'https://cdn.shopify.com/s/files/1/2418/2505/files/MN1091-CIN2803-DEF.webp?v=1728035904', alt: 'Image 2' },
    //     { name: '1', src: 'https://cdn.shopify.com/s/files/1/2418/2505/files/MN1091-CIN2803-DEF.webp?v=1728035904', alt: 'Image 3' },
    //     { name: '1', src: 'https://cdn.shopify.com/s/files/1/2418/2505/files/MN1091-CIN2803-DEF.webp?v=1728035904', alt: 'Image 1' },
    //     { name: '1', src: 'https://cdn.shopify.com/s/files/1/2418/2505/files/MN1091-CIN2803-DEF.webp?v=1728035904', alt: 'Image 2' },
    //     { name: '1', src: 'https://cdn.shopify.com/s/files/1/2418/2505/files/MN1091-CIN2803-DEF.webp?v=1728035904', alt: 'Image 3' },
    //     { name: '1', src: 'https://cdn.shopify.com/s/files/1/2418/2505/files/MN1091-CIN2803-DEF.webp?v=1728035904', alt: 'Image 1' },
    //     { name: '1', src: 'https://cdn.shopify.com/s/files/1/2418/2505/files/MN1091-CIN2803-DEF.webp?v=1728035904', alt: 'Image 2' },
    //     { name: '1', src: 'https://cdn.shopify.com/s/files/1/2418/2505/files/MN1091-CIN2803-DEF.webp?v=1728035904', alt: 'Image 3' },
    //     { name: '1', src: 'https://cdn.shopify.com/s/files/1/2418/2505/files/MN1091-CIN2803-DEF.webp?v=1728035904', alt: 'Image 1' },
    //     { name: '1', src: 'https://cdn.shopify.com/s/files/1/2418/2505/files/MN1091-CIN2803-DEF.webp?v=1728035904', alt: 'Image 2' },
    //     { name: '1', src: 'https://cdn.shopify.com/s/files/1/2418/2505/files/MN1091-CIN2803-DEF.webp?v=1728035904', alt: 'Image 3' },
    //     // 添加更多图片对象
    // ]
    let images;
    const selectedItem = ref(null);
    const showPreview = ref(false);
    function handleClick(item: any){
      selectedItem.value = item;
      showPreview.value = true;
      console.log("FAFAFA", selectedItem)
    }

    function FindFilesWithExtensions(folderPath: string, extensions: string[]): string[] {
      let result = [] as any;

      function TraverseFolder(currentPath: string) {
          const files = fs.readdirSync(currentPath);

          for (const file of files) {
              const fullPath = path.join(currentPath, file);
              const stats = fs.statSync(fullPath);

              if (stats.isDirectory()) {
                  // 递归遍历子文件夹
                  TraverseFolder(fullPath);
              } else if (stats.isFile() && extensions.some(ext => fullPath.endsWith(ext))) {
                  // 添加符合后缀条件的文件
                  const dir = path.dirname(fullPath);
                  const fileName = path.basename(fullPath);
                  const fileExt = path.extname(fullPath);
                  if(fileName != 'screenShot.png'){
                    switch(fileExt){
                      case '.png':
                        result.push({ name: fileName, type: 'image', screenShot: fullPath, video: '' });
                        break;
                      case '.mp4':
                        result.push({ name: fileName, type: 'video', screenShot: path.join(dir, 'screenShot.png'), video: fullPath });
                        break;
                    }
                    
                  }
              }
          }
      }

      TraverseFolder(folderPath);
      return result;
    }

    // 扫描图库信息
    function ScanGallery(){
      const root = "D://data";
      images = FindFilesWithExtensions(root, ['.png', '.mp4']);
    }

    ScanGallery();

    return { selectedItem, ScanGallery, showPreview, centerDialogVisible, click, Options, images, options, handleClick };
  },
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
