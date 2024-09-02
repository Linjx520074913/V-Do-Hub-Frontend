import axios from "axios";

const CryptoJs = require("crypto-js");

function getSignature(curTime: string, key: string, secret: string) {
    const signData = key + "\n" + curTime + "\n";
    const appSignature = genSignature(signData, secret);

    return appSignature;
};

function genSignature(message: string, secret: string) {
    const hash = CryptoJs.HmacSHA256(message, secret);
    const base64Hash = CryptoJs.enc.Base64.stringify(hash);

    return base64Hash;
}

function getTimeStamp() {
    const dateNow = (Date.now() / 1000).toFixed(0);
    return dateNow;
}


function getBaseRequester () {
    const appKey = "";
    const appSecret = "";

    const baseRequester = axios.create();

    baseRequester.defaults.timeout = 4000;
    // baseRequester.defaults.baseURL = 'http://10.10.150.80:8000/'; // Test server
    baseRequester.interceptors.request.use(
        (config: any): any => {
    
            const curTime = getTimeStamp();
            const appSignature = getSignature(curTime, appKey, appSecret);
    
            config.headers["X-Ca-Key"] = appKey;
            config.headers["System-time"] = curTime;
            config.headers["X-Ca-Signature"] = appSignature;
            
            return config;
        },
        (err: any) => {
            return Promise.reject(err);
        }
    );

    return baseRequester;
}

const baseRequester = getBaseRequester();



export {
    axios,
    baseRequester
};