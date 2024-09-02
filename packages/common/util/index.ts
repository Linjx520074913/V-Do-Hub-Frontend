import path from "path";
import fs from "fs";
import moment from "moment";

const os = require('os')

enum Platform{
    WINDOWS = "windows",
    LINUX = "linux"
};
class Util{

    /**
     * 获取 mac 地址
     * @returns 
     */
    static getMac() : string{

        let mac = ''
        let networkInterfaces=os.networkInterfaces();
        for(let i in networkInterfaces){
            for(let j in networkInterfaces[i]){
                if(networkInterfaces[i][j]["family"]==="IPv4" && networkInterfaces[i][j]["mac"]!=="00:00:00:00:00:00" && networkInterfaces[i][j]["address"]!=="127.0.0.1"){
                    mac = networkInterfaces[i][j]["mac"]
                }
            }
        }
        return mac
    } 

    /**
     * 获取广播地址, 广播地址为本地 ip 地址最后一节替换为 255
     * 如： 本地 ip 地址为 192.168.1.100,  则广播地址为 192.168.1.255
     */
    static getBrocastIPAddress() : string{

        const localIPAddress = Util.getIP()
        const lastIndex = localIPAddress.lastIndexOf('.')

        return localIPAddress.substring(0, lastIndex) + '.255'

    }

    /**
     * 
     * @returns string 获取本地 ip 地址
     */
    static getIP() : string {
        
        let interfaces = os.networkInterfaces()
        for (let devName in interfaces) {
            let iface = interfaces[devName]
            for (let i = 0; i < iface.length; i++) {
                let alias = iface[i]
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    const ip: string = alias.address
                    if(Number(ip.split('.')[3]) != 1){
                        return alias.address
                    }
                }
            }
        }

        return ''

    }

    /**
     * 获取主机名
     * @returns 
     */
     static getUserName(): string{
    
        return os.userInfo().username
    
    }

    static formatMessage(msg: string){

        const currentTime = moment(new Date()).format("YYYY-MM-DD hh:mm:ss.SSS")
        return '[' + currentTime + '] [ info  ] : ' + msg

    }

     /**
     * 获取系统版本
     * @returns Platform.WINDOWS、Platform.LINUX
     */
      static getSystem(){

        //  major.minor.build
        //  windows 各版本对应 ： https://docs.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-osversioninfoexw#remarks
        //  Version                                    major.minor
        //  Windows 10, Windows Server 2016            10.0
        //  Windows 8.1, Windows Server 2012 R2        6.3
        //  Windows 8, Windows Server 2012             6.2
        //  Windows 7, Windows Server 2008 R2          6.1
        //  Windows Vista, Windows Server 2008         6.0
        //  Windows XP Professional x64 Edition,       5.2
        //  Windows Server 2003, Windows Home Server
        //  Windows XP                                 5.1
        //  Windows 2000                               5.0
        const os = require('os');
        let platform = os.platform;

        return {
            platform: platform == "win32" ? "windows" : "linux",
            arch: os.arch()
        }

    }

    /**
     * 下载并解压
     * @param url        下载链接
     * @param totalBytes 文件总大小 
     * @param source     下载文件存放路径
     * @param cb         下载状态回调函数
     */
    static async downloadFile(url: string, totalBytes: number, source: string, cb: Function){

        // 已接收的文件大小
        let receivedBytes = 0;

        if (totalBytes != undefined) {

            const request = require('request');

            const req = request({ method: 'GET', uri: url });
            
            // 压缩包路径
            const fullPath = path.join(source);

            req.pipe(fs.createWriteStream(fullPath));

            req.on('data', (chunk: string | any[]) => {

                receivedBytes += chunk.length

                const percent = Math.floor(receivedBytes / totalBytes * 100);
                
                cb(percent > 99 ? 99 : percent);

            })

            req.on("end", ()=>{
                cb(100);
            })

        }

    }

    /**
     * 解压文件
     * @param source 源文件路径 
     * @param target 解压路径
     */
    static async extractFile(source: string, target: string){

        return new Promise((resolve, reject)=>{
            // 引入adm-zip
            var admZip = require('adm-zip');

            // 加载并解析存在的d:/test.zip文件
            try{
                var zip = new admZip(source);

                // 写入到d:/test.zip中，也可以是其他path
                zip.extractAllTo(target, true);

                fs.unlink(source, err => {
                    if (err) {
                        console.log(err)
                        reject(false);
                    }
                })
            }catch(error: any){
                console.log(error)
                reject(false);
            }
            
            resolve(true);
        })
        
    }

    static getCurrentTime(){
        const date = new Date();
        // return "[" + moment(date.getTime()).format('YYYY-MM-DD HH:mm:ss:SSS') + "]"
        return "[" + moment(date.getTime()).format('YYYY-MM-DD HH:mm:ss') + "]";
    }

}

export { Util }