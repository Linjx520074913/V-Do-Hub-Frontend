<template>
    <div ref="root">
        <div
            class="player"
            ref="player"
        ></div>

        <!-- <div :class="['slide-block', { 'z-vis': currentFilterName }]">
            <span class="demonstration">程度</span>
            <el-slider @input="slide" v-model="currentFilterValue" />
        </div>
        <div class="flex flex-row w-full h-22 border border-red-400 p-x-4 space-x-2 overflow-x-auto">
            <div v-for="(item, index) in filters" :key="index" class='w-20 h-20 border border-grey-500 flex flex-row justify-center hover:border-blue-500' @click="activeFilter(item)">
                <img :src="item.coverUrl" class="object-fill"/>
                <p>{{  item.name  }}</p>
            </div>
        </div>
        <p>{{ actived.name }}</p> -->
    </div>
</template>

<script lang="ts">
import { SetupContext, onMounted, onUnmounted, ref } from "vue"
import { contextIsolated } from 'process'

const fs = require('fs')
const useMediaFilter = require('rj-media-filter')

export interface Filter{
    appCode: string,
    code: string,
    coverUrl: string,
    hotFlag: number,
    id: string,
    name: string,
    shortName: string,
    resUrl: string,
    resourceId: string,
    seq: number,
    userTimes: number
}

export default {
    name: "RJMediaPlayer",
    props: {
        media:{
            type: Object
        }
    },

    emits: [
        'load'
    ],
    components: {},

    setup(props: any, context: SetupContext) {
        const filters = ref([] as Filter[])
        const actived = ref({} as Filter)

        function activeFilter(item: Filter){
            console.log('FAFAFDfA', item)
            actived.value = item
            currentFilterName.value = item.code
            setFilter(item.code, currentFilterValue.value)
        }

        const slide = (v: any) => {
            currentFilterValue.value = v
            setFilter(currentFilterName.value, v)
        }

        function changeFilterValue(value: number){
            currentFilterValue.value = value
            setFilter(currentFilterName.value, currentFilterValue.value)
        }

        const onFilterLoad = (list: Filter[]) => {
            filters.value = list
            const target = []
            const shortNameMap = new Map<string, string>()
            shortNameMap.set('整体提亮', '加亮')
            shortNameMap.set('金光提亮', '金光')
            shortNameMap.set('鲜红提亮', '鲜红')
            shortNameMap.set('银白经典', '银白')
            shortNameMap.set('湛蓝加深', '湛蓝')
            shortNameMap.set('草绿饱满', '草绿')
            for(let i = 0; i < list.length; i++){
                if(shortNameMap.get(list[i].name)){
                    list[i].shortName = shortNameMap.get(list[i].name)!
                    target.push(list[i])
                }
            }
            context.emit('load', target)
        }
        const onFilterError = (ex: any) => {
            console.error(ex)
        }
        const { setFilter, createCameraApp, createImageApp } = useMediaFilter(
            {
                appKey: '2bfabb92b675454bbcbe4d0bf1e192c9',
                appSecret: '005394d43582442381bcee95d8ea9b9c',
                env: 'develop'
            },
            onFilterLoad,
            onFilterError
        )
        const app = ref()
        const root = ref()
        const player = ref()
        const frameWidth = ref(0)
        const frameHeight = ref(0)
        const playerWidth = ref(400)
        const playerHeight = ref(500)
        const currentFilterName = ref('')
        const currentFilterValue = ref(0)

        const changeFilter = async (v: any) => {
            currentFilterName.value = v
            setFilter(v, currentFilterValue.value)
        }

        const setFrameSize = (option: any) => {
            frameWidth.value = option.frameWidth
            frameHeight.value = option.frameHeight
            app.value.setFrameSize(option.frameWidth, option.frameHeight)
            fixPlayerSize()
        }

        let appcreated = false
        const updateImg = async (data: Uint8Array, width: number, height: number) => {
          
            if (appcreated) {
                app.value?.updateCameraData(player.value, data, width, height)
            } else {
                appcreated = true
                app.value = await createCameraApp(player.value, data, width, height)
                
                initObserver()
            }
        }

        // 保存截图
        const saveScreenshot = (picName: any, canvas: any) => {
            return new Promise(async (resolve, reject) => {
                const px = await app.value.extractPixels()
                if (!canvas) {
                canvas = document.createElement('canvas')
                }
                canvas.width = px.width
                canvas.height = px.height
                const ctx = canvas.getContext('2d')
                ctx.putImageData(px, 0, 0)
                const dataURL = canvas.toDataURL()
                const buffer = Buffer.from(dataURL.split(',')[1], 'base64')
                fs.writeFile(picName, buffer, (err: any) => {
                if (err) {
                    reject(err)
                    throw err
                }
                resolve(picName)
                })
            })
        }

        let mediaRecorder: any
        // 录制视频
        const recordVideo = (videoName: any) => {
            return new Promise(async (resolve, reject) => {
                const stream = app.value.captureStream()
                const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
                ? 'video/webm;codecs=vp9'
                : 'video/webm'
                let chunks = [] as any
                let audio = await getDisplayMediaSource() as any
                if (audio) {
                // 将获取的音频流数据添加到视频流
                stream.addTrack(audio.getAudioTracks()[0])
                }
                mediaRecorder = new MediaRecorder(stream, { mimeType })
                mediaRecorder.ondataavailable = (e: any) => {
                if (e.data && e.data.size > 0) {
                    chunks.push(e.data)
                }
                }
                mediaRecorder.onstop = async () => {
                if (!chunks.length) return
                const blob = new Blob(chunks)
                const buffer = Buffer.from(await blob.arrayBuffer())
                fs.writeFile(videoName, buffer, (err: any) => {
                    console.log(err)
                    if (err) {
                    reject(err)
                    throw err
                    }
                    resolve(videoName)
                })
                chunks = []
                }
                mediaRecorder.start(1000)
            })
        }

        const recordVideoStop = async () => {
            mediaRecorder.stop()
        }

        // 获取麦克风音频或者系统音频方法
        // configVoiceType: microphone,system
        const getDisplayMediaSource = async (configVoiceType = 'microphone') => {
            let audioStream = null
            // 选择录音条件，分为系统和麦克风
            let constraints = null
            if (configVoiceType === 'microphone') {
                constraints = { audio: true, video: false }
            }
            if (configVoiceType === 'system') {
                constraints = {
                audio: {
                    mandatory: { chromeMediaSource: 'desktop' }
                },
                video: {
                    mandatory: { chromeMediaSource: 'desktop' }
                }
                }
            }
            await navigator.mediaDevices
                .getUserMedia(constraints as any)
                .then(function (audio) {
                /* 使用这个stream */
                audioStream = audio
                })
                .catch(function (err) {
                /* 处理error */
                console.log('获取麦克风失败：' + err)
                audioStream = null
                })
            return audioStream
        }

        const fixPlayerSize = () => {
            // const bcr = player.value.getBoundingClientRect()
            // let w = frameWidth.value
            // let h = frameHeight.value
            // let u = w / h
            // if (bcr.width / bcr.height > u) {
            //     h = bcr.height
            //     w = h * u
            // } else {
            //     w = bcr.width
            //     h = w / u
            // }
            // // if (w > frameWidth.value || h > frameHeight.value) {
            // //   w = frameWidth.value
            // //   h = frameHeight.value
            // // }
            // playerWidth.value = 600
            // playerHeight.value = 800
            // console.log('########### fixPlayerSize ############', playerWidth.value, playerHeight)
            // console.log('############## afafaf !!!!!!', player.value.firstElementChild)
            // player.value.firstElementChild.style.width = '1280px'
            // player.value.firstElementChild.style.height = '960px'

            const container = document.getElementById('player')
            const containerWidth = player.value.offsetWidth;
            const containerHeight = player.value.offsetHeight;
            console.log('=FFFF!!', containerWidth, containerHeight)

            // 根据容器大小和视频比例调整
            if (containerWidth / containerHeight > 4 / 3) {
                player.value.firstElementChild.style.width = `${(containerHeight * 4) / 3}px`;
                player.value.firstElementChild.style.height = `${containerHeight}px`;
            } else {
                player.value.firstElementChild.style.width = `${containerWidth}px`;
                player.value.firstElementChild.style.height = `${(containerWidth * 3) / 4}px`;
            }

            player.value.firstElementChild.style.borderRadius = '5px'
        }

        const initObserver = () => {
            frameWidth.value = app.value.width
            frameHeight.value = app.value.height
            observer = new ResizeObserver(fixPlayerSize)
            console.log('######### initObServer', frameWidth.value, frameHeight.value)
            observer.observe(root.value)
        }

        let observer: any
        const init = async () => {
            if (props.media) {
                app.value = await createImageApp(player.value, props.media)
                initObserver()
            }
        }


        onMounted(init)

        onUnmounted(() => {
        if (observer) {
            observer.disconnect()
            observer = null
        }
        if (app.value) {
            app.value.destroy()
            app.value = null
        }
        })

        return { changeFilterValue, filters, actived, activeFilter, app, root, player, frameWidth, frameHeight, playerWidth, playerHeight, currentFilterName, currentFilterValue, slide, changeFilter, setFrameSize, appcreated, updateImg, saveScreenshot, mediaRecorder, recordVideo, recordVideoStop, getDisplayMediaSource, fixPlayerSize, initObserver, observer }
    }
};
</script>
<style lang="scss">
@import "./local.scss";
.player {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 1024px;
  height: 768px;
  margin-left: auto;
  margin-right: auto;
}
/* Ensuring canvas covers the parent container without distortion */
.player canvas {
  object-fit: cover; /* or 'contain' if you want to ensure the whole canvas fits */
  width: 100%;
  height: 100%;
}
</style>
