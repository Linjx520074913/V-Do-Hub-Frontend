<template>
    <div class="root flex flex-col max-w-screen-sm h-full" ref="root">
        <div
            class="player"
            ref="player"
        ></div>
            
        

        <div :class="['slide-block', { 'z-vis': currentFilterName }]">
            <span class="demonstration">程度</span>
            <el-slider @input="slide" v-model="currentFilterValue" />
        </div>
        <div class="flex flex-row w-full h-22 border border-red-400 p-x-4 space-x-2 overflow-x-auto">
            <div v-for="(item, index) in filters" :key="index" class='w-20 h-20 border border-grey-500 flex flex-row justify-center hover:border-blue-500' @click="activeFilter(item)">
                <img :src="item.coverUrl" class="object-fill"/>
                <!-- <p>{{  item.name  }}</p> -->
            </div>
        </div>
        <p>{{ actived.name }}</p>
    </div>
</template>

<script lang="ts">
import { SetupContext, onMounted, onUnmounted, ref } from "vue"

const fs = require('fs')
const useMediaFilter = require('rj-media-filter')

export interface Filter{
    appCode: string,
    code: string,
    coverUrl: string,
    hotFlag: number,
    id: string,
    name: string,
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
            actived.value = item
            currentFilterName.value = item.code
            setFilter(item.code, currentFilterValue.value)
        }
        const onFilterLoad = (list: Filter[]) => {
            filters.value = list
            context.emit('load', list)
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
        const playerWidth = ref(0)
        const playerHeight = ref(0)
        const currentFilterName = ref('')
        const currentFilterValue = ref(0)

        const slide = (v: any) => {
            currentFilterValue.value = v
            setFilter(currentFilterName.value, v)
        }

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
                let chunks = []
                let audio = await getDisplayMediaSource()
                if (audio) {
                // 将获取的音频流数据添加到视频流
                stream.addTrack(audio.getAudioTracks()[0])
                }
                mediaRecorder = new MediaRecorder(stream, { mimeType })
                mediaRecorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    chunks.push(e.data)
                }
                }
                mediaRecorder.onstop = async () => {
                if (!chunks.length) return
                const blob = new Blob(chunks)
                const buffer = Buffer.from(await blob.arrayBuffer())
                fs.writeFile(videoName, buffer, (err) => {
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
                .getUserMedia(constraints)
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
            const bcr = player.value.getBoundingClientRect()
            let w = frameWidth.value
            let h = frameHeight.value
            let u = w / h
            if (bcr.width / bcr.height > u) {
                h = bcr.height
                w = h * u
            } else {
                w = bcr.width
                h = w / u
            }
            // if (w > frameWidth.value || h > frameHeight.value) {
            //   w = frameWidth.value
            //   h = frameHeight.value
            // }
            playerWidth.value = w
            playerHeight.value = h
            console.log('#######################', w, h)
            // player.value.querySelector()
        }

        const initObserver = () => {
            frameWidth.value = app.value.width
            frameHeight.value = app.value.height
            observer = new ResizeObserver(fixPlayerSize)
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

        return { filters, actived, activeFilter, app, root, player, frameWidth, frameHeight, playerWidth, playerHeight, currentFilterName, currentFilterValue, slide, changeFilter, setFrameSize, appcreated, updateImg, saveScreenshot, mediaRecorder, recordVideo, recordVideoStop, getDisplayMediaSource, fixPlayerSize, initObserver, observer }
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
  width: 400px;
  height: 400px;
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
