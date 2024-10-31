/** Common Dependencies */
import { LocalStorage, OpenLocal, SelectLocal, OpenExternal } from "./Common/index";
import { Locale } from "./Locale/index";
/** (END)Common Dependencies */

import { StaticResource } from "./StaticResource/index";
import { Requester } from "./Requester/index";

import { Messenger } from "./Messenger/index";
import { Platform } from "./Platform/index";


import { MainWindow } from "./MainWindow/index";
import { UI } from "./UI/index";

import { Theme } from "./Theme/index";
import { Sudoer } from "./Sudoer/index";

export {
      LocalStorage as DSLocalStorage,
      OpenLocal as DSOpenLocal,
      SelectLocal as DSSelectLocal,
      OpenExternal as DSOpenExternal,
      Locale as DSLocale,
};

export {
      Messenger as DSMessenger,
      Platform as DSPlatform,
      MainWindow as DSMainWindow
};

export {
      Theme as DSTheme,
      UI as DSUI,
      StaticResource as DSStaticResource,
      Requester as DSRequester,
      Sudoer as DSSudoer,
}