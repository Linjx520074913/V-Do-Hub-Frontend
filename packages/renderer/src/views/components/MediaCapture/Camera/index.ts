import { onMounted, onUnmounted, ref } from "vue";
import { Messenger } from "@/components/index";
import fs from "fs";
import path from "path";

import { Camera, Global } from '@/store/index'

const player = ref(null);

const enable = ref(true);


const isVideo = ref(false);

const autoExtract = ref(false);
const enableBeautify = ref(false);

const time = ref(15);

function change(value: boolean){
    isVideo.value = value;
}

const filePath = ref("");

const videoPath = ref("");

const duration = ref(15);

const data = ref([] as string[]);

// Capture 数据源路径
const source = ref('')

async function TakePhoto(){
    data.value = [];
    
    if(!isVideo.value){
        source.value = await Camera.methods.takeScreenshot()
        console.log("!!!!!!!!!!!!!!!!!!!!!!!FDFFF", source.value)
    }else{
        Camera.methods.recordVideo(duration.value, async () => {
            videoPath.value = Global.currentDstVideoName;
            const result = await FindFilesWithExtensions(path.dirname(Global.currentDstVideoName), ['.png']);
            data.value = result as any;
        })

        let id = setInterval(() => {
            duration.value = duration.value - 1;
            if(duration.value == 1){
                duration.value = 15;
                clearInterval(id);
            }
        }, 1000);
    }
}

async function FindFilesWithExtensions(folderPath: string, extensions: string[])  {
    return new Promise<string[]>((resolve, reject) => {
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
                    const fileName = path.basename(fullPath);
                    if(fileName.includes("part")){
                        result.push(fullPath);
                    }
                }
            }
        }
    
        TraverseFolder(folderPath);
        resolve(result)
    })
  }

function init(){
    onMounted(() => {
        Camera.methods.open();
        Messenger.methods.subscribe("update-image", () => {
            Messenger.methods.getImage(0, 2, (info: any, data: Uint8Array) => {
                if(player &&player.value){
                    (player.value as any).render(data, info.width, info.height, info.format);
                }
                
            })
        });
    });
    onUnmounted(() => {
        Camera.methods.close()
    });
}
export { source, Camera, data, videoPath, duration, filePath, time, change, isVideo, init, player, enable, TakePhoto, isPreviewVisible, autoExtract, enableBeautify }