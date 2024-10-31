import { onMounted, onUnmounted, ref } from "vue";
import { Messenger } from "@/components/index";

const player = ref(null);

const enable = ref(true);

const drawer = ref(true);

function OpenDrawer(){
    
    drawer.value = true;
    console.log("FFFFFFFF OpenDrawer", drawer)
}

function init(){

}
export { init, player, enable, OpenDrawer, drawer }