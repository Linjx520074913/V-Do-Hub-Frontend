import { onMounted, onUnmounted, ref } from "vue";
import { Messenger } from "@/components/index";
import fs from "fs";
import path from "path";

const player = ref(null);

const enable = ref(true);

const isCameraConnected = ref(false);

const isPreviewVisible = ref(false);

const isVideo = ref(false);

const autoExtract = ref(false);
const enableBeautify = ref(false);

const time = ref(15);

function change(value: boolean){
    isVideo.value = value;
}

function OpenCamera(){
    Messenger.methods.publish("open-camera", {}, (result: any) => {
        console.log("############## open-camera ##############", result);
        isCameraConnected.value = result.value;
        // isCameraConnected.value = true;
    });
}   

function CloseCamera(){
    Messenger.methods.publish("close-camera", {}, () => {

    });
}

const filePath = ref("");

const videoPath = ref("");

const duration = ref(15);

const data = ref([] as string[]);

function TakePhoto(){
    const root = "D://data//";

    const now = new Date();
    const formattedDateTime = `${now.getFullYear()}-${String(
        now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}_${String(
        now.getHours()
    ).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}-${String(
        now.getSeconds()
    ).padStart(2, "0")}`;

    const dir = path.join(root, formattedDateTime);

    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    if(!isVideo.value){
        isPreviewVisible.value = true;

        // filePath.value = root + formattedDateTime + ".png";
        const filePath = path.join(dir, formattedDateTime + '.png');
        data.value.push(filePath);
        console.log("!!!!!!!!!!!!", filePath);
        Messenger.methods.publish("take-photo", {
            filePath: filePath,
        });
    }else{
        let rawPath = path.join(dir, formattedDateTime + '.avi');
        let dstPath = path.join(dir, formattedDateTime + '.mp4');
        let screenShotPath = path.join(dir, 'screenShot.png');
        videoPath.value = dstPath;
        Messenger.methods.publish("start-record", { duration: duration.value, raw: rawPath, dst: dstPath, screenShot: screenShotPath });
        let id = setInterval(() => {
            duration.value = duration.value - 1;
            if(duration.value == 1){
                duration.value = 15;
                clearInterval(id);
            }
        }, 1000);
    }
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
                const fileName = path.basename(fullPath);
                if(fileName.includes("part")){
                    result.push(fullPath);
                }
            }
        }
    }

    TraverseFolder(folderPath);
    return result;
  }

function init(){
    onMounted(() => {
        OpenCamera();
        Messenger.methods.subscribe("update-image", () => {
            Messenger.methods.getImage(0, 2, (info: any, data: Uint8Array) => {
                if(player &&player.value){
                    (player.value as any).render(data, info.width, info.height, info.format);
                }
                
            })
        });
        Messenger.methods.subscribe("finish-record", () => {
            // 遍历路径下
            console.log("!!!!!!!!", videoPath.value, path.dirname(videoPath.value));
            const result = FindFilesWithExtensions(path.dirname(videoPath.value), ['.png']);
            console.log("@@@@@@@@@@@@@@@@", result);
            data.value = result as any;
            isPreviewVisible.value = true;
        });
    });
    onUnmounted(() => {
        CloseCamera();
    });
}
export { data, duration, filePath, time, change, isVideo, init, player, enable, TakePhoto, isPreviewVisible, isCameraConnected, OpenCamera, autoExtract, enableBeautify }