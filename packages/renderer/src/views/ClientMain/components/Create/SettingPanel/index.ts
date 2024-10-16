import { onMounted, onUnmounted, ref } from "vue";
import { Messenger } from "@/components/index";

const AngleOptions = ['360°', '90°', '45°', '15°'];
const SpeedOptions = [
    { text: '快速', duration: 15 }, 
    { text: '慢速', duration: 30 }
];

const cur_angle = ref(AngleOptions[0]);
const cur_speed = ref(SpeedOptions[0]);

function ChangeAngle(value: any){
    cur_angle.value = value;
    // TODO：调整转盘角度
}

export { AngleOptions, SpeedOptions, cur_angle, cur_speed, ChangeAngle }