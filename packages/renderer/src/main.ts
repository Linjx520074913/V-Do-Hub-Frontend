import { createApp } from 'vue';
import App from './App.vue';

import "tailwindcss/tailwind.css";
import 'tw-elements';

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import "@/assets/icomoon/style.css";
import '@/assets/font/fonts.css';

import ObCommUI from 'ob-xw-common';

import VueVideoPlayer from '@videojs-player/vue'
import 'video.js/dist/video-js.css' 

const VueResizeObserver = require("vue-resize-observer");

const app = createApp(App)

import { Router } from '@/store/index'

Router.methods.init()

app.use(ElementPlus)
   .use(VueResizeObserver)
   .use(ObCommUI)
   .use(Router.data.router!)
   .use(VueVideoPlayer)
   .mount('#app')
   .$nextTick(window.removeLoading);


