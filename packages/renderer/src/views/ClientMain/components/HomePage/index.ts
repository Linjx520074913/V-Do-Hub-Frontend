import { Messenger } from "@/components";
import { ref } from "vue";

const player = ref(null);
const infomation0 = ref("");
const infomation1 = ref("");

enum MotionStatus{
    GO_HOME_SUCCESS = 0,
    Get_INFO_SUCCESS,
};

Messenger.methods.subscribe("update-image", () => {
    Messenger.methods.getImage(0, 2, (info: any, data: Uint8Array) => {
        (player.value as any).render(data, info.width, info.height, info.format);
    })
});

Messenger.methods.subscribe("update-motion-message", (data:any) => {
    console.log("@@@@@@@@@@@@@@@@@@ update-motion-message", data);
    switch(data.status){
        case MotionStatus.GO_HOME_SUCCESS:
            break;
        case MotionStatus.Get_INFO_SUCCESS:
            infomation0.value = `Motor 1 : position = ${data.position[0]}  , velocity = ${data.velocity[0]}`;
            infomation1.value = `Motor 2 : position = ${data.position[1]}  , velocity = ${data.velocity[1]}`;
            break;
        default:
            break;
    }
});

function AutoFocus(){
    Messenger.methods.publish("auto-focus", {});
}

function Capture(){
    Messenger.methods.publish("capture", {});
}

function Record(){
    Messenger.methods.publish("record", {});
}

function GoHome(){
    Messenger.methods.publish("go-home", {});
}

function MoveAbsolute(){
    Messenger.methods.publish("move-absolute", { nodeId: 0, position: 0 });
}

function MoveRelative(){
    Messenger.methods.publish("move-relative", { nodeId: 0, distance: 10 });
}

export { AutoFocus, Capture, Record, player, GoHome, MoveAbsolute, MoveRelative, infomation0, infomation1 }