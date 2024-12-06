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
import { createMemoryHistory, createRouter } from 'vue-router';

import { Setting, MediaLibrary, Mall, UserLogin, UserRegister, MediaCapture, AccountZone } from './views/components/index';

const app = createApp(App);

const routes = [
    { path: '/',             component: UserLogin },
    { path: '/MediaCapture', component: MediaCapture },
    { path: '/MediaLibrary', component: MediaLibrary },
    { path: '/UserLogin',    component: UserLogin   },
    { path: '/Setting',      component: Setting },
    { path: '/Mall',         component: Mall    },
    { path: '/UserRegister', component: UserRegister },
    { path: '/AccountZone',  component: AccountZone }
]

export const router = createRouter({
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


