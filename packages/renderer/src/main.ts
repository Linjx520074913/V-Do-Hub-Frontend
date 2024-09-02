import { createApp } from 'vue';

import App from './App.vue';

import "tailwindcss/tailwind.css";
import 'tw-elements';

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import "@/assets/icomoon/style.css";
import '@/assets/font/fonts.css';

import ObCommUI from 'ob-xw-common';

const VueResizeObserver = require("vue-resize-observer");

const app = createApp(App);

						
			
// var devInnerHeight = 1080.0 // 开发时的InnerHeight
// var devDevicePixelRatio = 1.0// 开发时的devicepixelratio
// var devScaleFactor = 2 // 开发时的ScaleFactor
// var scaleFactor = screen.getPrimaryDisplay().scaleFactor
// var zoomFactor = (window.innerHeight / devInnerHeight) * (window.devicePixelRatio / devDevicePixelRatio) * (devScaleFactor / scaleFactor)


app.use(ElementPlus)
   .use(VueResizeObserver)
   .use(ObCommUI)
   .mount('#app')
   .$nextTick(window.removeLoading);

