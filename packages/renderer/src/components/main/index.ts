import { onBeforeMount, onMounted, ref } from "vue";
import { ObPlayer } from "ob-xw-common";
import { ipcRenderer } from "electron";
import { ObEvent } from "../../../../common/event/ob-event-bus";


function mount(){
    onMounted(() => {
        ipcRenderer.send(ObEvent.UI_MOUNTED);
    });
}

export { ObPlayer, mount };