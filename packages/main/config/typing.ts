/**
 * 窗口配置
 */
interface WindowConfig {
  width: number,          // 宽度
  height: number,         // 高度
  minWidth?: number,      // 最小宽度
  minHeight?: number,     // 最小高度
  title?: string,         // 标题
  icon?: string           // 图标地址
  isDev?: boolean,
  platform: string
}

/**
 * 广播服务器配置
 */
interface BroadcastServerConfig{
  multicastIp: string,    // 组播地址
  interval: number,       // 广播间隔
  timeout: number,        // 超时时间
  port: {
    bind: number,         // 绑定端口
    target: number,       // 目标端口
    control: number,      // 控制指令端口
    depth: number,        // depth 数据传输端口
    ir: number,           // ir 数据传输端口
    color: number,        // color 数据传输端口
    pointCloud: number,   // 点云数据传输端口
    log: number           // 日志传输端口
  }
}

/**
 * 消息服务器配置
 */
interface MessageServerConfig{
  maxHttpBufferSize: number
}

/**
 * Axios 配置
 */
interface AxiosConfig{
  baseURL: string,
  webServerURL: string
}

/**
 * 插件配置
 */
interface ExtensionConfig{
  localPath: string
}

/**
 * 插件信息
 */
type ExtensionInfo = {
  name: string,              // 插件名
  displayName: string,       // 插件用于显示的名字
  description: string,       // 插件简要描述
  version: string,           // 插件版本号
  developer: string,         // 插件开发者
  icon: string,              // 插件图标地址
  size: Number,              // 插件大小
  brief:{       
    released: string,        // 插件发布日期
    last: string,            // 插件最后更新日期
    identifier: string       // 插件 id 号
  },
  main: string,              // 主入口
  detail:Array<JSON>         // 详情

}

/**
 * 节点信息
 */
type NodeInfo = {
  name: string,
  mac: string,
  ip: string
}


export { WindowConfig, BroadcastServerConfig, MessageServerConfig, AxiosConfig, ExtensionConfig, ExtensionInfo, NodeInfo }
