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

import { Setting, MediaLibrary, MediaCapture, Mall, UserLogin, UserRegister, UserZone } from './views/components/index';
import Main from "@/components/main/index.vue"

const app = createApp(App)

const routes = [
    { path: RouterPath.BASE,             component: UserLogin },
    { path: RouterPath.USER_LOGIN,       component: UserLogin },
    { path: RouterPath.USER_REGISTER,    component: UserRegister },
    { 
        path: RouterPath.MAIN,
        component: Main,
        children:[
            { path: RouterPath.MEDIA_CAPTURE,    component: MediaCapture },
            { path: RouterPath.MEDIA_LIBRARY,    component: MediaLibrary },
            { path: RouterPath.USER_ZONE,        component: UserZone },
            { path: RouterPath.SETTING,          component: Setting },
            { path: RouterPath.MALL,             component: Mall    }
        ]
    }
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
export { RouterPath, router }


