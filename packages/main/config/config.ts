import { AxiosConfig, BroadcastServerConfig, ExtensionConfig, MessageServerConfig, WindowConfig } from "./typing"
import { Logger } from "tslog"
import * as process from "process"

const windowConfig : WindowConfig = {
  width: 1100,
  height: 700,
  minWidth: 940,
  minHeight: 680,
  title: 'CrealityScan',
  icon: '@/assets/logo.png',
  isDev: process.env.NODE_ENV !== 'production',
  platform: process.platform
}

const broadcaseServerConfig : BroadcastServerConfig = {
  multicastIp: "225.0.0.101",    // 组播地址
  interval: 1500,                // 广播间隔
  timeout: 3000,                 // 超时时间
  port: {
    bind: 8060,                  // 绑定端口
    target: 8061,                // 目标端口
    control: 5010,               // 控制指令端口
    depth: 5011,                 // depth 数据传输端口
    ir: 5012,                    // ir 数据传输端口
    color: 5013,                 // color 数据传输端口
    pointCloud: 5014,            // 点云数据传输端口
    log: 5015,                   // 日志传输端口
    
  }
}

const messageServerConfig: MessageServerConfig = {
  maxHttpBufferSize: 1e8
}

const axiosConfig: AxiosConfig = {
  baseURL: 'http://159.27.83.21:8080',
  // baseURL: 'http://40.73.75.41:8080',
  webServerURL: 'http://159.27.83.21:8080'
}

const extensionConfig: ExtensionConfig = {
  localPath: process.env['USERPROFILE'] + '\\.swifai\\extensions'
}

const logger = new Logger()

export { windowConfig, broadcaseServerConfig, messageServerConfig, axiosConfig, extensionConfig, logger }
