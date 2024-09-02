import { I18n, createI18n } from "vue-i18n";

import zhCN from "./zh-cn";
import enUS from "./en-us";
import deDe from "./de-de";
import jaJp from "./ja-jp";
import esEs from "./es-es";
import ptBr from "./pt-br";


export default class MultiLingual {
      private static instance: MultiLingual;

      private needReinit: boolean;

      private i18n: I18n;
      public t: any;


      private constructor () {
            this.i18n = createI18n({
                  locale: 'en-us',
                  fallbackLocale: 'en-us',
                  messages: {
                        'zh-cn': zhCN,
                        'en-us': enUS,
                        'de-de': deDe,
                        'ja-jp': jaJp,
                        'es-es': esEs,
                        'pt-br': ptBr,
                  },
                  legacy: false
            });
            this.t = this.i18n.global.t;

            this.needReinit = false;
      };

      protected setReinitFlag(target: boolean) {
            this.needReinit = target;
      }

      private reinitialize(targetLocale: string) {
            this.i18n = createI18n({
                  locale: targetLocale,
                  fallbackLocale: targetLocale,
                  messages: {
                        'zh-cn': zhCN,
                        'en-us': enUS,
                        'de-de': deDe,
                        'ja-jp': jaJp,
                        'es-es': esEs,
                        'pt-br': ptBr,
                        
                  },
                  legacy: false
            });
            this.t = this.i18n.global.t;
      }

      public static getInstance(needReinit?: boolean): MultiLingual {
            if (!MultiLingual.instance) {
                  MultiLingual.instance = new MultiLingual();
            }

            if (undefined != needReinit) {
                  MultiLingual.instance.setReinitFlag(needReinit);
            }

            return MultiLingual.instance;
      }

      public switchLocale(targetLocale: string): void {

            switch (targetLocale) {
                  case "zh-cn":
                        this.i18n.global.locale = "zh-cn";
                        break;
                  case "en-us":
                        this.i18n.global.locale = "en-us";
                        break;
                  case "ja-jp":
                        this.i18n.global.locale = "ja-jp";
                        break;
                        
                  default:
                        this.i18n.global.locale = "en-us";
                        break;
            }

            if (this.needReinit) {
                  this.reinitialize(targetLocale);
            }
      }
}

export { MultiLingual };