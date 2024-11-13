import { ref } from 'vue'
import fs from "fs"
import path from 'path'

import { Messenger } from "@/components/index"
import { VDoEvent } from '../EventBus/index'
import CameraDefaultConfig from "./camera_config.json"

// TODO: 这里的 dataRootDir 要换成程序安装目录
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
        isConnected: true,
        smoothness: 0,      // 磨皮程度
        brightness: 50,     // 亮度
        saturation: 50,     // 饱和度
        contrast: 50,       // 对比度
        sharpness: 50,      // 锐度
        hue: 50             // 色调
    },
    methods: {
        open(filePath?: string){
            let config = CameraDefaultConfig
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
                Camera.data.isConnected = result.value;
                // TODO
                // Camera.data.isConnected = true
            })
        },
        close(){
            Messenger.methods.publish(VDoEvent.CLOSE_CAMERA, {}, () => {});
        },
        async takeScreenshot(): Promise<string>{
            return new Promise((resolve, reject) => {
                const { picName, dir } = Global.methods.getCurrenDataInfo()
                Messenger.methods.publish(VDoEvent.TAKE_SCREEN_SHOT, { filePath: picName }, () => {
                    resolve(dir)
                })
            })
        },
        async recordVideo(duration: number): Promise<string>{
            return new Promise((resolve, reject) => {
                const { dir, rawVideoName, dstVideoName, screenShotName } = Global.methods.getCurrenDataInfo()
                Messenger.methods.publish(VDoEvent.START_RECORD_VIDEO, { duration: duration, raw: rawVideoName, dst: dstVideoName, screenShot: screenShotName }, () => {
                    resolve(dir)
                })
            })
        },
        delete(){
            try{
                fs.rm(Global.currentDataDir, { recursive: true, force: true }, (err) => {
                if (err) {
                    console.error("Failed to delete folder:", err);
                } else {
                    console.log("Folder deleted successfully!");
                }
            });
            }catch(error){

            }
        },
        setSmoothness(value: number){
            Messenger.methods.publish(VDoEvent.SET_SMOOTHNESS, { smoothness: value } )
        },
        setBrightness(value: number){
            Messenger.methods.publish(VDoEvent.SET_BRIGHTNESS, { brightness: value } )
        },
        setSaturation(value: number){
            Messenger.methods.publish(VDoEvent.SET_SATURAION, { saturation: value } )
        },
        setContrast(value: number){
            Messenger.methods.publish(VDoEvent.SET_CONTRAST, { contrast: value } )
        },
        setSharpness(value: number){
            Messenger.methods.publish(VDoEvent.SET_SHARPNESS, { sharpness: value } )
        },
        setHue(value: number){
            Messenger.methods.publish(VDoEvent.SET_HUE, { hue: value } )
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