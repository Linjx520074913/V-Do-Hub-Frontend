import fs from "fs";
import { Server } from "socket.io";
import { createServer } from "http";
import { v4 as uuidv4 } from 'uuid';
import { io } from "socket.io-client";
import { Uint32BufferAttribute } from "three";

const NUM_CHUNK_PER_DEVICE = 5;

enum XwStreamType{
    DEPTH = 0,
    IR = 1,
    COLOR = 2
}

interface XwFrameInfo{
    valid: number,
    width: number,
    height: number,
    length: number,
    format: number,
    fd: number,
    u0: number,
    v0: number 
}

interface XwStreamCallback{ (info: XwFrameInfo, data: Uint8Array): void }

class XwWrapper{

    callback: Map<string, Function>
    once: Map<string, Function>
    addon: any
    buffer: Map<number, Uint8Array>
    timer: Map<string, any>
    server: any
    clientNum: number

    constructor(path: string){

        const httpServer = createServer();
        this.server = new Server(httpServer, {
            maxHttpBufferSize: 1e8
        });
        httpServer.listen(5010);

        this.clientNum = 0;
        this.callback = new Map<string, Function>();
        this.once = new Map<string, Function>();
        this.buffer = new Map<number, Uint8Array>();
        this.timer = new Map<string, NodeJS.Timer>();

        if(!fs.existsSync(path)){
            return;
        }

        this.addon = require(path);
        if(this.addon){
            console.log("ob-xw-wrapper 加载成功", this.addon)
        }
        
        // this.server = io('http://localhost:5010'); 
        this.server.on("connection", (socket: any) => {
            console.log("connect");
            this.clientNum++;
            socket.on("message", (data: any) => {
                if(data == ""){
                    return;
                }

                let obj;
                try{
                    obj = JSON.parse(data);
                }catch(e){
                    console.log(e, "======", data)
                    return;
                }
                let event = obj.event + "-" + obj.uuid;
                let cb = (this.callback.get(event) == undefined ? this.callback.get(obj.event) : this.callback.get(event));
                if(cb != undefined){
                    cb(obj);
                }
    
                const once = (this.once.get(event) == undefined ? this.once.get(obj.event) : this.once.get(event));
                if(once != undefined){
                    once(obj);
                    this.once.delete(event);
                }
            });

            socket.on("disconnect", () => {
                console.log("disconnect");
                this.clientNum--;
                if(this.clientNum == 0 && this.callback.get("backend-dropped")){
                    (this.callback.get("backend-dropped") as any)();
                }
            });
        });
        // this.keepAlive();
        
    }

    getModelLength(){
        return this.addon.getModelLength();
    }

    getChunkInfo(chunkId: number){
        const info = this.addon.getChunkInfo(chunkId);
        return JSON.parse(info);
    }

    getRawData(deviceIndex: number, type: XwStreamType){

        const rawDataChunkId = deviceIndex * NUM_CHUNK_PER_DEVICE + type + 2;
        const rawDataInfo = this.getChunkInfo(rawDataChunkId);

        if(this.buffer.get(rawDataChunkId) == undefined || this.buffer.get(rawDataChunkId)?.length != rawDataInfo.length){
            this.buffer.set(rawDataChunkId, new Uint8Array(rawDataInfo.length));
        }

        const data = this.buffer.get(rawDataChunkId);
        if(data != undefined){
            this.addon.getChunkData(rawDataChunkId, rawDataInfo.length, data);
        }
        
        return { data: data, length: rawDataInfo.length };

    }

    getOffsetData(deviceIndex: number, type: XwStreamType, start: number, end: number){

        const rawDataChunkId = deviceIndex * NUM_CHUNK_PER_DEVICE + type + 2;

        var data = new Uint8Array(end - start);
        if(data != undefined){
            this.addon.getOffsetData(rawDataChunkId, start, end, data);
        }
        return data;

    }

    getImage(deviceIndex: number, type: XwStreamType, rawDataCB?: XwStreamCallback, renderDataCB? : XwStreamCallback){

        let rawDataChunkId = deviceIndex * NUM_CHUNK_PER_DEVICE + type + 2; 

        let rawDataInfo = this.getChunkInfo(rawDataChunkId);

        rawDataInfo = this.getChunkInfo(rawDataChunkId);
            
        if(rawDataCB != undefined){
            if(this.buffer.get(rawDataChunkId) == undefined || this.buffer.get(rawDataChunkId)?.length != rawDataInfo.length){
                this.buffer.set(rawDataChunkId, new Uint8Array(rawDataInfo.length));
            }
            
            const data = this.buffer.get(rawDataChunkId);
            if(data != undefined){
                this.addon.getChunkData(rawDataChunkId, rawDataInfo.length, data);
                rawDataCB(rawDataInfo, data);
            }
        }
        

        
        if(renderDataCB != undefined){
            let renderDataChunkId = 0;
            switch(type){
                case XwStreamType.DEPTH:
                    {
                        renderDataChunkId = deviceIndex * NUM_CHUNK_PER_DEVICE;
                    }
                    break;
                case XwStreamType.IR:
                    {
                        renderDataChunkId = deviceIndex * NUM_CHUNK_PER_DEVICE + 1;
                    }
                    break;
                case XwStreamType.COLOR:
                    {
                        renderDataChunkId = deviceIndex * NUM_CHUNK_PER_DEVICE + type + 2
                    }
                    break;
            }
            
            const renderDataInfo = this.getChunkInfo(renderDataChunkId);
            if(this.buffer.get(renderDataChunkId) == undefined || this.buffer.get(renderDataChunkId)?.length != renderDataInfo.length){
                this.buffer.set(renderDataChunkId, new Uint8Array(renderDataInfo.length));
            }
            
            const data = this.buffer.get(renderDataChunkId);
            if(data != undefined){
                this.addon.getChunkData(renderDataChunkId, renderDataInfo.length, data);
                renderDataCB(renderDataInfo, data);
            }
        }
    }

    stopStream(id: string){

        const timer = this.timer.get(id);
        if(timer != undefined){
            clearInterval(timer);
            this.timer.set(id, undefined);
        }
        
    }

    subscribe(event: string, callback: Function){
        this.callback.set(event, callback);
    }

    publish(event: string, data: any, callback?: Function){

        const uuid = uuidv4();

        if(callback){
            this.once.set(event + "-" + uuid, callback);
        }
        this.server.emit("message", JSON.stringify({
            event: event,
            uuid: uuid,
            data: data
        }));
    }

    getLargeDataLength(offset: number){
        return this.addon.getLargeDataLength(offset);
    }

    getLargeData(offset: number, length: number){
        
        var data = new Uint8Array(length);
        
        this.addon.getLargeData(offset, length, data);
        return data;
    }

    writeLargeData(data: Uint32Array){
        this.addon.writeLargeData(data);
    }

    keepAlive(){

        setInterval(() => {
            console.log("############## alive")
        }, 5000);

    }

}


export { XwWrapper, XwFrameInfo, XwStreamType }