// import { ref } from "vue";
// import { XwFrameInfo, XwStreamType } from "@/common/xwwrapper/index";
// import { XwMessenger } from "@components/index";
// import { ipcRenderer } from "electron";
// import { ObEvent } from "@common/index";

// // import { ObPCLPlayer, PointCloudType } from "../../components/ob-pcl-player";

// const depth = ref();
// const ir = ref();
// const color = ref();
// const pcl = ref();

// function preview(){
    
//     XwMessenger.publish("preview", {});
//     XwMessenger.startStream(0, XwStreamType.DEPTH, (info: XwFrameInfo, data: Uint8Array)=>{
//         (depth.value as any).render(data, info.width, info.height, info.format)
//     });
//     XwMessenger.startStream(0, XwStreamType.IR, (info: XwFrameInfo, data: Uint8Array)=>{
//         (ir.value as any).render(data, info.width, info.height, info.format)
//     });
//     XwMessenger.startStream(0, XwStreamType.COLOR, (info: XwFrameInfo, data: Uint8Array)=>{
//         (color.value as any).render(data, info.width, info.height, info.format)
//     });

//     XwMessenger.subscribe("UpdateCurrentPCL", () => {
//         const obj = XwMessenger.getRawData(1, XwStreamType.DEPTH);
//         if(obj && obj.data){
//             // 当前帧点云
//             // [0,                 info.length / 2] : 存放顶点数据
//             // [ info.length / 2,      info.length] : 存放向量数据
//             const v = new Float32Array(obj.data.slice(0, obj.length / 2).buffer);
//             const n = new Float32Array(obj.data.slice(obj.length / 2, obj.length).buffer);
//                 (pcl.value as any).updateMesh(PointCloudType.CURRENT, v, n);
//         }
//     });

//     XwMessenger.subscribe("UpdateHistoryPCL", () => {
//         const obj = XwMessenger.getRawData(1, XwStreamType.IR);
//         if(obj && obj.data){
//             // 数据排布
//             // [0,                 info.length / 2] : 存放顶点数据
//             // [ info.length / 2,      info.length] : 存放向量数据
//             // 历史帧点云
//             const v = new Float32Array(obj.data.slice(0, obj.length / 2).buffer);
//             const n = new Float32Array(obj.data.slice(obj.length / 2, obj.length).buffer);
//             (pcl.value as any).updateMesh(PointCloudType.HISTORY, v, n);
//         }
//     });

// }

// function startScanning(){

//     XwMessenger.publish("start", {});

// }

// function pauseScanning(){

//     XwMessenger.publish("pause", {});

// }

// function stopScanning(){

//     XwMessenger.publish("stop", {});

// }

// function loadModel(event: any){
    
//     console.log(event);
//     (pcl.value as any).loadModel(event.target.files[0]);
// }

// function reset(){
//     const data = ipcRenderer.sendSync(ObEvent.OPEN_FILE);
//     const file = new Blob([data]);
//     // (pcl.value as any).reset();
//     (pcl.value as any).loadModel(file);
// }

// function optimizate(){

//     XwMessenger.publish("optimizate", {});

// }

// export {
//     preview,
//     startScanning,
//     stopScanning,
//     pauseScanning,
//     optimizate,
//     depth,
//     ir,
//     color,
//     pcl,
//     loadModel,
//     reset,
//     ObPCLPlayer
// }