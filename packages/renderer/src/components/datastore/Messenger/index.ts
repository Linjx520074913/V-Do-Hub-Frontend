import { ref } from "vue";

import { config } from "@common/";

import { XwWrapper, XwStreamType, XwFrameInfo } from "@/common/xwwrapper/index";

// console.log(config.addonPath);
const XwMessenger = new XwWrapper(config.addonPath);

const MessengerRef = ref({
    methods: {
        sampleFunc: (
            path: string,
            callback?: Function
        ) => {
            XwMessenger.publish(
                "test",
                {
                    path: path
                },
                (data: any) => {
                    if (callback) {
                        callback(data);
                    }
                }
            );
        },

        appQuit: (callback?: Function) => {
            XwMessenger.publish(
                "closed",
                {},
                (res: any) => {
                    console.log("backend closed");
                    
                    if (callback) {
                        callback();
                    }
                }
            );
            
        },

        getImage: (deviceIndex: number, streamType: XwStreamType, callback: Function): void => {
            XwMessenger.getImage(deviceIndex, streamType, (info: XwFrameInfo, data: Uint8Array) => {
                callback(info, data);
            });
        },

        stopStream: (targetId: string) => {
            XwMessenger.stopStream(targetId);
        },

        
        // Raw Methods
        subscribe: (event: string, callback: Function) => {
            XwMessenger.subscribe(event, callback);
        },

        publish: (event: string, data: any, callback?: Function) => {
            XwMessenger.publish(event, data, callback);
        },

        getLargeDataLength: (offset: number) => {
            return XwMessenger.getLargeDataLength(offset);
        },

        getRawData: (
            channel: number,
            type: XwStreamType
        ) => {
            return XwMessenger.getRawData(channel, type);
        },

        getOffsetData: (
            channel: number,
            type:XwStreamType,
            start: number,
            end: number,
        ) => {
            return XwMessenger.getOffsetData(channel, type, start, end);
        },
    }
});

const Messenger = MessengerRef.value;

export { Messenger, XwMessenger };