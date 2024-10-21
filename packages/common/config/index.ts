import path from "path";
import os from "os";

interface Config {
    appData?: string,         // 本地数据存储路径
    broadcast:{
        port: {
            bind: number,     // 广播服务器绑定端口
            target: number    // 广播服务器目标端口
        },
        interval: number,     // 广播间隔
        timeout: number       // 广播超时
    },
    addonPath: string,
    backendPath: string,

    contentPath: string,
    resourcePath: string,
    dataPath: string,

    platform: string,
    logBasePath: string

}

import c from "./config.json"

const config : Config = c;

config.appData = "";

config.platform = process.platform;
config.contentPath = path.join(process.resourcesPath, "../");
config.resourcePath = process.resourcesPath;

// TODO: switch default project root path based on platform
switch (config.platform) {
    case "win32":
        config.dataPath = config.contentPath;
        config.addonPath = path.join(process.resourcesPath, "extraResources", "addon", process.platform, process.arch, "ob-xw-wrapper-node.node");
        config.backendPath = path.join(process.resourcesPath, "extraResources", "backend", process.platform, process.arch, "V-DoHub-Backend.exe");
        // config.backendPath = "F:/code/lingxi/V-Do-Hub-Backend/build/Release/V-DoHub-Backend.exe";
        // config.addonPath = "F:/code/lingxi/V-Do-Hub-Frontend/extraResources/addon/win32/x64/ob-xw-wrapper-node.node";
        config.logBasePath = path.join(config.dataPath, "logs");
        break;
    case "darwin":
    default:
        config.dataPath = path.join(os.homedir(), "Documents", "RosRecord");
        config.addonPath = path.join(process.resourcesPath, "extraResources", "addon", process.platform, "universal", "ob-xw-wrapper-node.node");
        config.backendPath = path.join(process.resourcesPath, "extraResources", "backend", process.platform, "universal", "RosRecord");
        config.logBasePath = path.join(config.dataPath, "logs");
        break;
}




// console.log(config);
export { config }