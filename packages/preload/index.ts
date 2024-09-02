import { domReady } from './utils'
import { useLoading } from './loading'
import { desktopCapturer } from 'electron'

const { appendLoading, removeLoading } = useLoading()
window.removeLoading = removeLoading
// TODO : electron 18 配合 rtcmulticonnect 有问题，故改为 electron16
// window.navigator.mediaDevices.getDisplayMedia = () => {  

//     return new Promise(async (resolve, reject) => {
//       	try {
// 			const sources = await desktopCapturer.getSources({ types: ['window'] })
			
// 			// 获取指定窗口流
// 			let selectedSourceId = "";
// 			for(let i = 0; i < sources.length; i++){
// 				const current = sources[i];
// 				if(current.name == "Vite App"){
// 					selectedSourceId = current.id;
// 					break;
// 				}
// 			}
// 			const stream = await window.navigator.mediaDevices.getUserMedia({
// 				audio: false,
// 				video: {
// 				mandatory: {
// 					chromeMediaSource: 'desktop',
// 					chromeMediaSourceId: selectedSourceId
// 				}
// 				}
// 			})
// 			resolve(stream)
//         }catch(err){
//             reject(err)
//         }       
//     })

// }

domReady().then(appendLoading)
