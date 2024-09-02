import { App, Plugin } from 'vue';
import ObScanner from './src/index.vue'

export const ObScanWorkerPlugin: Plugin = {
  install(app: App) {
    app.component('ObScanWorker', ObScanner);
  },
};

export * from "./src";
export { ObScanner };