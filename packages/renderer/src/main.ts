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

import { RouterPath } from '@/store/index'

const VueResizeObserver = require("vue-resize-observer");
import { createMemoryHistory, createRouter } from 'vue-router';

import { Setting, MediaLibrary, MediaCapture, Mall, UserLogin, UserRegister, UserZone, AIScene } from './views/components/index';

import Main from "@/components/main/index.vue"

const app = createApp(App)

// const routes = [
//     { path: RouterPath.BASE,      component: MediaCapture },
//     { path: '/MediaCapture',      component: MediaCapture },
//     { path: '/MediaLibrary',      component: MediaLibrary },
//     { path: '/UserZone',          component: UserZone },
//     { path: '/Setting',           component: Setting },
//     { path: '/Mall',              component: Mall },
//     { path: '/AIScene',           component: AIScene },
// ];

// const router = createRouter({
//     history: createMemoryHistory(),
//     routes
// })

import Foo from './vuerouter/Foo/index.vue'
import Bar from './vuerouter/Bar/index.vue'
import Parent from './vuerouter/Parent/index.vue'

const childRouters = [
    { path: 'foo', component: Foo },
    { path: 'bar', component: Bar }
]

const routes = [
    { path: '/', component: UserLogin },
    { path: '/login', component: UserLogin },
    { path: '/main', component: Main }
]

const router = createRouter({
    history: createMemoryHistory(),
    routes
})

app.use(ElementPlus)
   .use(VueResizeObserver)
   .use(ObCommUI)
   .use(router)
   .use(VueVideoPlayer)
   .mount('#app')
   .$nextTick(window.removeLoading);
export { RouterPath }


