import { ref } from "vue";
import { ipcRenderer } from "electron";
import { MultiLingual, ObEvent } from "@common/index";
import { LocalStorage } from "../Common/index";
import { LSItem } from "@/common/export/enum";

const LocaleRef = ref({
    curLocale: "en-us",
    
    instance: MultiLingual.getInstance(),

    methods: {
        switchTo: (targetLocale: string) => {
            Locale.curLocale = targetLocale;
            Locale.instance.switchLocale(targetLocale);
            ipcRenderer.send(ObEvent.SWITCH_LOCALE, {targetLocale: targetLocale});
            LocalStorage.methods.set(LSItem.LOCALE, targetLocale);
        },
    
        init: () => {
            // Locale.instance = instance;
    
            const storedLocale = LocalStorage.methods.get(LSItem.LOCALE);
            if (null != storedLocale) {
                Locale.methods.switchTo(storedLocale);
            }
        }
    }
    
});

const Locale = LocaleRef.value;


export { Locale };