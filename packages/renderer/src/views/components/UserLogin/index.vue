<template>
    <div class="flex flex-row bg-transparent  w-[1069px] h-[602px] justify-center items-center">
        <div class="w-1/2 h-full login-bg"/>
        <div class="w-1/2 h-full relative bg-white">
            <div v-if="Account.data.loginMethod === LoginMethod.WECHAT" class="w-full h-full flex flex-col justify-center items-center">
                <p>微信登录</p>
                <p>请扫描微信二维码登录</p>
                <webview ref="webview" id="webview" :src="Account.data.wechatURL" style="width:0px;height:0px"/>
                <div class="qrcode p-2" style="width:300px;height:300px">
                    <img v-if="url != ''" :src="url" alt=""/>
                </div>
                <p class="text-xs">登录即表示同意《服务条款》和《个人信息保护政策》</p>
            </div>
            <div v-else class="w-full h-full p-20 login-form  max-w-sm mx-auto">
                手机号码和获取验证码按钮
                <div class="mb-6 flex items-center space-x-4">
                    <!-- 手机号码输入框 -->
                    <div class="flex-1">
                        <label for="phone" class="block text-lg font-semibold text-gray-800">手机号码</label>
                        <div class="flex flex-row justify-center items-center">
                            <input 
                            type="text" 
                            id="phone"
                            v-model="phoneNum"
                            placeholder="请输入手机号码"
                            class="mt-3 p-1 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out hover:border-blue-400"
                            />
                            <el-button 
                                type="primary" 
                                @click="sendPhoneVerificationCode(phoneNum)"
                                class="w-32 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-600 transition duration-300 ease-out transform hover:scale-105 focus:ring-2 focus:ring-blue-500"
                            >
                                获取验证码
                            </el-button>
                        </div>
                    </div>
                </div>

                <!-- 验证码 -->
                <div class="mb-6">
                    <label for="smsCode" class="block text-lg font-semibold text-gray-800">验证码</label>
                    <input 
                        type="password" 
                        id="smsCode"
                        v-model="smsCode" 
                        placeholder="请输入验证码"
                        class="mt-3 p-1 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out hover:border-blue-400"
                    />
                </div>

                <!-- 登录按钮 -->
                <button 
                    @click="loginWithPhoneNum(phoneNum, smsCode)" 
                    class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition duration-300 ease-out transform hover:scale-105 focus:ring-2 focus:ring-blue-500"
                >
                    登录
                </button>
            </div>
            <button :class="['absolute top-2 left-2 text-white p-2 text-sm', Account.data.loginMethod === LoginMethod.PHONE? 'login-with-qrcode' : 'login-with-phone']" @click="Account.methods.toggleLoginMethod"/>
        </div>
    </div>
    <!-- <UserRegister v-else/> -->
</template>

<script lang="ts">
import { SetupContext, ref, onMounted, onUnmounted } from "vue"
import QRCode from 'qrcode'
import { Account, LoginMethod } from '@/store/index'
import { router, RouterPath } from '@/main'
import UserRegister  from '../UserRegister/index.vue'
import { ipcRenderer } from 'electron'
import { ObEvent } from "@common/";

export default {
  name: "UserLogin",
  props: {},

  emits: [],
  components: { UserRegister },

  setup(props: any, context: SetupContext) {

    const url = ref("")
    const curLoginMethod = ref(LoginMethod.WECHAT)
    const phoneNum = ref('15019456440')
    const smsCode = ref('')

    let qrcodeTimer: any = null

    const loading = ref(true)
    
    const updateQRCode = async () => {
        try{
            const webview = document.querySelector("webview") as any;
            webview
                .executeJavaScript(`document.querySelector('.qrcode').outerHTML`)
                .then((res: any) => {
                    
                        const uuid = res?.match(/src="\/connect\/qrcode\/(\S*)">/)[1];
                        const qrCodeUrl = `https://open.weixin.qq.com/connect/confirm?uuid=${uuid}&chInfo=ch_share__chsub_CopyLink`;
                        console.log("qrcodeUrl", qrCodeUrl)
                        QRCode.toDataURL(qrCodeUrl, { margin: 0 }, (err: any, u: string) => {
                            if (err) return
                            url.value = u  // 更新二维码 URL
                        
                })
            })
        }catch(error: any){
            console.log('####@@@@@@@@@@@@@@@@@@@@', error)
        }
    }

    onMounted(async () => {

        Account.methods.loginWithToken().then((isSuccess: boolean) => {
            if(!isSuccess){
                // 登录过期
                loading.value = false
                
                const webview = document.querySelector("webview") as any;
                if(webview && curLoginMethod.value === LoginMethod.WECHAT){
                    webview.reload()
                }
                
                qrcodeTimer = setInterval(() => {
                    if(webview && curLoginMethod.value === LoginMethod.WECHAT){
                        webview.reload()
                    }
                }, 20000)
                webview.addEventListener('dom-ready', async () => {
                    console.log('!!!!!!!!!!!! dom-ready')
                    if(!Account.data.isLogin){
                        updateQRCode()
                    }
                })
                // 微信扫码后的webView跳转监听
                webview.addEventListener("will-navigate", async (e: any) => {
                    // 匹配找到 code 字段数据
                    const match = e.url.match(/[?&]code=([^&]+)/)
                    const code = match ? match[1] : null
                    console.log("#### will-navigate get wechat code : ", code)
                    await Account.methods.loginWithWechat(code)
                    // TODO: 登录成功之后，修改窗口大小及位置
                    ipcRenderer.send(ObEvent.WINDOW_RESIZE, { width: 1920, height: 1080, center: true })
                    // Account.data.isLogin = true
                    // Account.data.needRegister = true
                })
            }else{
                // router.push(`${RouterPath.MEDIA_CAPTURE}`)
                ipcRenderer.send(ObEvent.WINDOW_RESIZE, { width: 1920, height: 1080, center: true })
            }
        })

    })

    onUnmounted(() => {
        if(qrcodeTimer){
            clearInterval(qrcodeTimer)
        }
    })

    async function sendPhoneVerificationCode(phone: string){
        smsCode.value = await Account.methods.sendPhoneVerificationCode(phone)
    }

    async function loginWithPhoneNum(phoneNum: string, smsCode: string){
        const user_profile = await Account.methods.loginWithPhoneNum(phoneNum, smsCode)
        if(user_profile){
            ipcRenderer.send(ObEvent.WINDOW_RESIZE, { width: 1920, height: 1080, center: true })
        }
    }

    return { loading, Account, LoginMethod, sendPhoneVerificationCode, loginWithPhoneNum, url, curLoginMethod, phoneNum, smsCode }
  },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";

.login-with-qrcode{
    width: 70px;
    height: 61px;
    background-image: url('@/assets/images/login-with-qrcode.png');
}
.login-with-phone{
    width: 70px;
    height: 61px;
    background-image: url('@/assets/images/login-with-phone.png');
}

.login-bg{
    background-image: url('@/assets/images/login-bg.png');
    background-size: cover;
    background-position: center;    
}
.login-content{
    width: 350px;
    height: 350px;
    background-color: white; 
}

.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.login-methods {
    display: flex;
    margin-bottom: 20px;
}

.login-methods button {
    margin-right: 10px;
}

.login-methods .active {
    font-weight: bold;
    color: blue;
}

.login-form {
    display: flex;
    flex-direction: column;
}

.login-form input {
    margin-bottom: 10px;
}
</style>
