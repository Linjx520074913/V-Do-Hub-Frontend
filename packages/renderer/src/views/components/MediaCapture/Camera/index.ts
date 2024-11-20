import { onMounted, onUnmounted, ref } from "vue";
import { Messenger } from "@/components/index";
import { VDoEvent } from '@/store/EventBus/index'
import { Camera } from '@/store/index'

const player = ref(null);

const isVideo = ref(false);

const autoExtract = ref(false);
const enableBeautify = ref(false);

const time = ref(15);

function change(value: boolean){
    isVideo.value = value;
}

const duration = ref(15);

// Capture 数据源路径
const source = ref('')

async function TakePhoto(){
    if(!isVideo.value){
        source.value = await Camera.methods.takePhoto()
    }else{
        let id = setInterval(() => {
            duration.value = duration.value - 1;
            if(duration.value == 1){
                duration.value = 15;
                clearInterval(id);
            }
        }, 1000);
        source.value = await Camera.methods.recordVideo(duration.value)  
    }
}

function init(){
    onMounted(() => {
        Camera.methods.open();
        Messenger.methods.subscribe(VDoEvent.UPDATE_IMAGE, () => {
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
export { source, Camera, duration, time, change, isVideo, init, player, TakePhoto, autoExtract, enableBeautify }