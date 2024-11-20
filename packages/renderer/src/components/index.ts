import { ipcRenderer, webFrame } from "electron";
import Package from "@/../../../package.json";

import { ref, computed, onMounted, onBeforeMount, nextTick } from "vue";

import path from "path";
import fs from "fs";

import { ObEvent, config } from "@common/";
import Footer from "./footer/index.vue";

import { 
    DSLocalStorage,
    DSOpenLocal,
    DSSelectLocal,
    DSOpenExternal,
    DSLocale,

    DSMessenger,
    DSPlatform,

    DSMainWindow,
    DSTheme,
    DSUI,
    DSStaticResource,
    DSRequester,
    DSSudoer,
} from "./datastore/index";
import { VDoEvent } from "@/store/EventBus";


let meta = ref({

    reset: () => {
        console.log(">>> STORE RESET <<<");
    },

    computed: {
    },


    Messenger: DSMessenger,


    Platform: DSPlatform,

    // UI
    UI: DSUI,

    // 多语言
    Locale: DSLocale,

    // 主题
    Theme: DSTheme,

    // LocalStorage
    LocalStorage: DSLocalStorage,

    SelectLocal: DSSelectLocal,

    OpenLocal: DSOpenLocal,

    OpenExternal: DSOpenExternal,

    StaticResource: DSStaticResource,

    MainWindow: DSMainWindow,

    Requester: DSRequester,

    Sudoer: DSSudoer,

});

const Store = meta.value;
const Locale = meta.value.Locale;
const Theme = meta.value.Theme;

const LocalStorage = meta.value.LocalStorage;

const SelectLocal = meta.value.SelectLocal;
const OpenLocal = meta.value.OpenLocal;
const OpenExternal = meta.value.OpenExternal;

const StaticResource = meta.value.StaticResource;

const UI = meta.value.UI;
const Platform = meta.value.Platform;
const MainWindow = meta.value.MainWindow;

const t = Locale.instance.t;

const Messenger = meta.value.Messenger;

const Requester = meta.value.Requester;
const Sudoer = meta.value.Sudoer;


function init(): void {
    console.log(">>>Current version: ", Package.version, "<<<");
    // 初始化 UI 数据
    UI.init();

    Requester.methods.init(Package.version);

    Sudoer.methods.init(config.platform);

    // LocalStorage.methods.clear();
    Platform.init(config.platform);
    Locale.methods.init();

    mountMessengerSubcription();
};

function mountMessengerSubcription(): void {
    onBeforeMount(() => {
        ipcRenderer.on(ObEvent.QUIT_APP, (event: any) => {
            ipcRenderer.sendSync(ObEvent.APP_FORCE_QUIT);
        });

        ipcRenderer.on(ObEvent.SEND_ZOOM_FACTOR, (event: any, factor: number) => {
            if (factor < 1.25) {
                UI.methods.setZoomFactor(1.25);
                // UI.methods.setZoomFactor(1.148);
            } else {
                // UI.methods.setZoomFactor(1.148);
                UI.methods.setZoomFactor(1.148);
            }
        });

        ipcRenderer.on(ObEvent.WINDOW_FULLSCREEN, (event: any, data: boolean) => {
            MainWindow.methods.toggleFullScreen(data);
        });

        ipcRenderer.on(ObEvent.WINDOW_MAXIMIZE_UNMAXIMIZE, (event: any, data: boolean) => {
            MainWindow.methods.toggleMaximize(data);
        });
    });
    
    onMounted(() => {
        Messenger.methods.subscribe(VDoEvent.BACKEND_INITED, (obj: any) => {
            console.log(obj);
        });
    });
};

export { path, fs };
export { Footer };
export { UI, init };

export { t, Locale };
export { Theme };

export { Package };

export {
    Messenger,
    
    MainWindow,
    Platform,
    Store,
    LocalStorage,
    StaticResource,
    OpenLocal,
    OpenExternal,
    SelectLocal,

    Requester,
    Sudoer
}