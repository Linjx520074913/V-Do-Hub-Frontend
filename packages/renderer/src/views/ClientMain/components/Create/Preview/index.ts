import { onMounted, onUnmounted, ref } from "vue";
import { Messenger } from "@/components/index";

const player = ref(null);

const enable = ref(true);

const drawer = ref(true);

function OpenCamera(){
    Messenger.methods.publish("open-camera", {}, () => {

    });
}   

function CloseCamera(){
    Messenger.methods.publish("close-camera", {}, () => {

    });
}

function OpenDrawer(){
    
    drawer.value = true;
    console.log("FFFFFFFF OpenDrawer", drawer)
}

function init(){
    onMounted(() => {
        OpenCamera();
        Messenger.methods.subscribe("update-image", () => {
            Messenger.methods.getImage(0, 2, (info: any, data: Uint8Array) => {
                (player.value as any).render(data, info.width, info.height, info.format);
            })
        });
    });
    onUnmounted(() => {
        CloseCamera();
    });
}
export { init, player, enable, OpenDrawer, drawer }