import { ref, reactive, computed } from "vue";
import { ipcRenderer, webFrame } from "electron";
import { ObEvent } from "@common/event/ob-event-bus";

import { DSMainWindow as MainWindow } from "../index";

const UIRef = ref({
      backendDropped: false,
      closing: false,

      showCloseAppPrompt: false,

      zoomFactor: 1.0,

      header: {
            left: {} as any,
            middle: [] as any,

            middleIndex: 0,

            right: [
                  { icon: "icon-minimize",     click: function() { ipcRenderer.send(ObEvent.WINDOW_MINIMIZE, ''); } },
                  { icon: computed((): string => { return MainWindow.computed.isMaximized ? "icon-resize" : "icon-enlarge" }), click: function() { ipcRenderer.send(ObEvent.WINDOW_MAXIMIZE, ''); } },
                  { icon: "icon-close",     click: function() { ipcRenderer.send(ObEvent.WINDOW_CLOSE, ''); } }
            ],
            init: () => {
                  UI.header.middle = reactive([
                  { label: "preview", icon: "icon-orbbec", component: "PreviewMain", disabled: false },
                  ]);                    
            }
      },
      init: () => {
            UI.header.init();
      },

      methods: {
            setZoomFactor: (targetFactor: number) => {

                  UI.zoomFactor = targetFactor;
                  webFrame.setZoomFactor(UI.zoomFactor);
            },

            closeApp: () => {
                  ipcRenderer.send(ObEvent.WINDOW_CLOSE, '');
            },

            toggleCloseAppPromptVisibility: (value: boolean) => {
                  UI.showCloseAppPrompt = value;
            },
      }
});

const UI = UIRef.value;


export { UI };