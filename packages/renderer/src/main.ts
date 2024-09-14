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

import { createMemoryHistory, createRouter } from 'vue-router';

import { Setting, Gallery, Create, Mall } from './views/ClientMain/components/index';
			
// var devInnerHeight = 1080.0 // 开发时的InnerHeight
// var devDevicePixelRatio = 1.0// 开发时的devicepixelratio
// var devScaleFactor = 2 // 开发时的ScaleFactor
// var scaleFactor = screen.getPrimaryDisplay().scaleFactor
// var zoomFactor = (window.innerHeight / devInnerHeight) * (window.devicePixelRatio / devDevicePixelRatio) * (devScaleFactor / scaleFactor)


const routes = [
    { path: '/',        component: Create },
    { path: '/Create',  component: Create },
    { path: '/Setting', component: Setting },
    { path: '/Gallery', component: Gallery },
    { path: '/Mall',    component: Mall }
]

export const router = createRouter({
    history: createMemoryHistory(),
    routes
})

app.use(ElementPlus)
   .use(VueResizeObserver)
   .use(ObCommUI)
   .use(router)
   .mount('#app')
   .$nextTick(window.removeLoading);


