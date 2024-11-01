import fs from 'fs'
import path from 'path'

enum LSItem {
    DEFAULT_PROJECT_PATH = "defaultProjectPath",
    LOCALE = "locale",
    RECENT_PROJECT_PATH_LIST = "recentProjectPathList",
    REVERSE_RECENT_PROJECT_PATH_LIST = "reverse",
    HIDE_QUICK_START = "dontShowQuickStart",
    DARWIN_ADMIN_USR_MAP = "adminObjMap",
    MUTE_DEVICE = "muteDevice",
    HIDE_DEVICE_CONNECTED_PROMPT = "dontShowDeviceConnectedPrompt",
    USED_DEVICE_PID_LIST = "usedDevicePidList",
    SHOW_DEPTH_DIAGRAM = "showDepthDiagram",
    CALIB_BOARD_INFO_LIST = "calibBoardInfoList",
    DEFAULT_EXPORT_PATH = "defaultExportPath",
    LAST_DEVICE_SN = "lastDeviceSn",
    ENTER_PROCESS_PAGE_NUMBER ="EnterProcessPageNumber"
}

export {
    LSItem
};

export { fs, path }