import { ref } from 'vue'
import fs from "fs"
import path from 'path'

import { Messenger } from "@/components/index"
import { VDoEvent } from '../EventBus/index'
import CameraDefaultConfig from "./camera_config.json"


const GlobalRef = ref({
    dataRootDir: 'D://data//',
    currentDataDir: '',
    currentPicName: '',
    currentRawVideoName: '',
    currentDstVideoName: '',
    currentScreenShotName: '',
    methods: {
        getCurrenDataInfo(){
            const now = new Date()
            const formattedDateTime = `${now.getFullYear()}-${String(
                now.getMonth() + 1
            ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}_${String(
                now.getHours()
            ).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}-${String(
                now.getSeconds()
            ).padStart(2, "0")}`;
            const dir = path.join(Global.dataRootDir, formattedDateTime)
            if(!fs.existsSync(dir)){
                fs.mkdirSync(dir, { recursive: true })
            }

            Global.currentDataDir = dir
            Global.currentPicName = path.join(dir, formattedDateTime + '.png')
            Global.currentRawVideoName = path.join(dir, formattedDateTime + '.avi')
            Global.currentDstVideoName = path.join(dir, formattedDateTime + '.mp4')
            Global.currentScreenShotName = path.join(dir, 'screenShot.png')

            return { dir: dir, picName: Global.currentPicName, rawVideoName: Global.currentRawVideoName, dstVideoName: Global.currentDstVideoName, screenShotName: Global.currentScreenShotName }
        }
    },
})

const Global = GlobalRef.value;

const HardwareRef = ref({
    data: {

    },
    methods: {
    },
})

const CameraRef = ref({
    data:{
        isConnected: false
    },
    methods: {
        open(filePath?: string){
            let config = CameraDefaultConfig
            if(filePath){
                try{
                    config = JSON.parse(fs.readFileSync(filePath, 'utf8'))
                }catch(error){
                    console.error('Error reading camera config file', error);
                }
            }
            // TODO: 优化这里的参数设置
            Messenger.methods.publish(VDoEvent.OPEN_CAMERA, {
                'CAP_PROP_AUTO_WB':        config.CAP_PROP_AUTO_WB,
                'CAP_PROP_WB_TEMPERATURE': config.CAP_PROP_WB_TEMPERATURE,
                'CAP_PROP_SHARPNESS':      config.CAP_PROP_SHARPNESS,
                'CAP_PROP_BRIGHTNESS':     config.CAP_PROP_BRIGHTNESS,
                'CAP_PROP_CONTRAST':       config.CAP_PROP_CONTRAST,
                'CAP_PROP_SATURATION':     config.CAP_PROP_SATURATION,
                'CAP_PROP_HUE':            config.CAP_PROP_HUE,
                'CAP_PROP_AUTO_EXPOSURE':  config.CAP_PROP_AUTO_EXPOSURE,
                'CAP_PROP_GAIN':           config.CAP_PROP_GAIN,
                'CAP_PROP_EXPOSURE':       config.CAP_PROP_EXPOSURE
            }, (result: any) => {
                console.log('[ Camera ] : connect = ', result.value)
                // Camera.data.isConnected = result.value;
                // TODO
                Camera.data.isConnected = true
            })
        },
        close(){
            Messenger.methods.publish(VDoEvent.CLOSE_CAMERA, {}, () => {});
        },
        takeScreenshot(){
            const { picName } = Global.methods.getCurrenDataInfo()
            Messenger.methods.publish(VDoEvent.TAKE_SCREEN_SHOT, { filePath: picName })
        },
        recordVideo(duration: number, onFinishCallback: any){
            const { rawVideoName, dstVideoName, screenShotName } = Global.methods.getCurrenDataInfo()
            Messenger.methods.publish(VDoEvent.START_RECORD_VIDEO, { duration: duration, raw: rawVideoName, dst: dstVideoName, screenShot: screenShotName }, () => {
                if(onFinishCallback){
                    onFinishCallback()
                }
            })
        }
    },
})
const Camera = CameraRef.value;

const Turntable = ref({
    data:{

    },
    methods:{

    }
})

const Hardware = HardwareRef.value;

export { Hardware, Camera, Global }