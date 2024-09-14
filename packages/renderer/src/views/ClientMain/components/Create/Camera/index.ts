import { onMounted, ref } from "vue";
import { Messenger } from "@/components/index";

const player = ref(null);

function init(){
    onMounted(() => {
        Messenger.methods.subscribe("update-image", () => {
            Messenger.methods.getImage(0, 2, (info: any, data: Uint8Array) => {
                console.log("FFFFFFFFF update image");
                (player.value as any).render(data, info.width, info.height, info.format);
            })
        });
    });
}
export { init, player }