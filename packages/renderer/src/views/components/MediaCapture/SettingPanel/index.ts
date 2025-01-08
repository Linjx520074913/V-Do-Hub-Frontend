import { onMounted, onUnmounted, ref } from "vue";
import { Messenger } from "@/components/index";

const AngleOptions = [
    { text: '360°', angle: 360},
    { text: '90°', angle: 90},
    { text: '45°', angle: 45},
    { text: '30°', angle: 30}
];
const SpeedOptions = [
    { text: '快速', duration: 15, tstr: "fast" }, 
    { text: '慢速', duration: 30, tstr: "slow" }
];

const cur_angle = ref(AngleOptions[0]);
const cur_speed = ref(SpeedOptions[0]);

function ChangeAngle(value: any){
    cur_angle.value = value;
    // TODO：调整转盘角度
}
export { AngleOptions, SpeedOptions, cur_angle, cur_speed }