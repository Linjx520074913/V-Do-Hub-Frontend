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

import { Setting, Gallery, Mall, Login, Capture } from './views/ClientMain/components/index';

const routes = [
    { path: '/',        component: Login   },
    { path: '/Capture', component: Capture },
    { path: '/Login',   component: Login   },
    { path: '/Setting', component: Setting },
    { path: '/Gallery', component: Gallery },
    { path: '/Mall',    component: Mall    }
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


