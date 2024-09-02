import { ref } from "vue";
import { ipcRenderer, shell } from "electron";
import { ObEvent } from "@common/event/ob-event-bus";

/** LocalStorage */
const LocalStorageRef = ref({
      methods: {
          get: (key: string) => {
              return localStorage.getItem(key);
          },

          set: (key: string, item: string) => {
              localStorage.setItem(key, item);
          },

          clear: () => {
              localStorage.clear();
          }
      }
});

const LocalStorage = LocalStorageRef.value;
/** (END)LocalStorage */


/** Select local */
const SelectLocalRef = ref({
      selecting: false,

      methods: {
        toggleSelecting: (value?: boolean) => {
            if (undefined != value) {
                SelectLocal.selecting = value;
            } else {
                SelectLocal.selecting = !SelectLocal.selecting;
            }
        },
        // selectFile: (filters: { name: string, extensions: string[]}[]) => {
        //     const result = ipcRenderer.sendSync(ObEvent.OPEN_FILE, { filters: filters });
        //     console.log(result);
        //     if(!result.canceled){
        //         return result.filePaths[0] as string;
        //     }

        //     return "";
        // },

        selectFolder: () => {
            const result = ipcRenderer.sendSync(ObEvent.OPEN_DIRECTORY);
            if(!result.canceled){
                return result.filePaths[0] as string;
            }

            return "";
        },

        selectFileAsync: (filters: { name: string, extensions: string[]}[], callback: Function) => {
            SelectLocal.methods.toggleSelecting(true);
            
            ipcRenderer.invoke(
                ObEvent.OPEN_FILE_ASYNC,
                { filters: filters }
            )
            .then((result) => {
                if(result && !result.canceled){
                    callback(result.filePaths[0] as string);
                } else {
                    callback("");
                }

                SelectLocal.methods.toggleSelecting(false);
            });
        },

        selectFolderAsync: (callback: Function) => {
            SelectLocal.methods.toggleSelecting(true);
            
            ipcRenderer.invoke(
                ObEvent.OPEN_DIRECTORY_ASYNC,
                { }
            )
            .then((result) => {
                if(!result.canceled){
                    callback(result.filePaths[0] as string);
                } else {
                    callback("");
                }

                SelectLocal.methods.toggleSelecting(false);
            });
        },

        selectFileOrFolderAsync: (callback?: Function) => {
            SelectLocal.methods.toggleSelecting(true);
                
            ipcRenderer.invoke(
            ObEvent.OPEN_FILE_OR_DIRECTORY_ASYNC,
            )
            .then((result) => {
                console.log(">>>>>OPEN RES:", result);

                SelectLocal.methods.toggleSelecting(false);
            });
        },

        saveFileAsync: async (filters: any) => {
            SelectLocal.methods.toggleSelecting(true);

            const res = await ipcRenderer.invoke(
                ObEvent.SAVE_FILE_ASYNC,
                { filters: filters }
            );

            SelectLocal.methods.toggleSelecting(false);
            
            return res;
        }
      }
});

const SelectLocal = SelectLocalRef.value;
/** (END)Select local */


/** Open local */
const OpenLocalRef = ref({
      methods: {
          OpenLocalPath: (localPath: string) => {
              shell.openPath(localPath);
          }
      }
});

const OpenLocal = OpenLocalRef.value;
/** (END)Open local */


const OpenExternalRef = ref({
    methods: {
        openLink: (link: string) => {
            shell.openExternal(link);
        }
    }
});

const OpenExternal = OpenExternalRef.value;

export {
    LocalStorage,
    SelectLocal,
    OpenLocal,
    OpenExternal,
}

