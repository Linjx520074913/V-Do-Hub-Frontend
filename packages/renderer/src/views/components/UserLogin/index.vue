<template>
    <div class="flex flex-row bg-transparent w-full h-full">
        <!-- 背景图 -->
        <div class="w-1/2 h-full login-bg"/>
        <!-- 登录 -->
        <div class="w-1/2 h-full relative bg-white">
            <!-- 微信登录 -->
            <div :class="['w-full h-full flex flex-col items-center', Account.data.loginMethod === LoginMethod.WECHAT? '' : 'hidden']">
                <p class="text-[30px] font-bold mt-[100px]">微信登录</p>
                <p class="text-[16px] mt-[13px] text-[#6A6A6A]">微信扫描即可完成注册登录</p>
                <webview ref="webview" id="webview" :src="Account.data.wechatURL" class="w-[0px] h-[0px]"/>
                <div class="qrcode p-2 w-[250px] h-[250px] mt-[28px]">
                    <img v-if="url != ''" :src="url" alt=""/>
                </div>
                <p class="text-[14px] mt-[27px] font-bold">
                    登录即表示同意 
                    <a href="https://www.baidu.com" class="text-[#0073FF]" target="_blank">《服务条款》</a> 和 
                    <a href="https://www.baidu.com" class="text-[#0073FF]" target="_blank">《个人信息保护政策》</a>
                </p>
                <p class="text-[14px]  font-bold">
                    未注册微信号登录时会自动创建账号
                </p>
            </div>
            <!-- 手机登录 -->
            <div v-if="Account.data.loginMethod === LoginMethod.PHONE"  class="w-full h-full flex flex-col items-center">
                <p class="text-[30px] font-bold mt-[100px]">登录</p>
                <div class="w-[359px] h-[45px] mt-[27px] flex flex-row border rounded-[5px]">
                    <select v-model="countryCode" class="country-code w-[80px] h-full flex items-center justify-center ">
                        <option value="+86">+86</option>
                    </select>
                    <input class="flex-1 border border-gray px-[10px]"
                        type="text" inputmode="numeric" oninput="this.value=this.value.replace(/[^0-9]/g,'')"
                        maxlength="11"
                        v-model="phoneNum"
                        placeholder="请输入您的手机号码">
                </div>
                <div class="w-[359px] h-[45px] mt-[27px] flex flex-row border rounded-[5px]">
                    <input class="flex-1 border-t-0 border-l-0 border-b-0 border-gray px-[10px]"
                        type="text" inputmode="numeric" oninput="this.value=this.value.replace(/[^0-9]/g,'')"
                        maxlength="6"
                        v-model="smsCode"
                        placeholder="请输入验证码">
                        <button 
                            class="px-3 text-sm text-blue-500 font-medium hover:text-blue-700 active:text-blue-900 focus:outline-none"
                            @click="sendPhoneVerificationCode(phoneNum)"
                        >
                            {{ prompt }}
                        </button>
                </div>
                <!-- 登录 -->
                <div class="w-[359px] h-[45px] rounded-3xl bg-main-color flex items-center justify-center text-white text-[30px] mt-[74px] cursor-pointer"
                    @click="loginWithPhoneNum(phoneNum, smsCode)" >登录</div>
                <!-- 服务条款 -->
                <div class="flex flex-row h-[20px] mt-[93px] items-center justify-center">
                    <p class="text-[14px] font-bold ml-[5px]">
                        登录即表示同意 
                        <a href="https://www.baidu.com" class="text-[#0073FF]" target="_blank">《服务条款》</a> 和 
                        <a href="https://www.baidu.com" class="text-[#0073FF]" target="_blank">《个人信息保护政策》</a>
                    </p>
                </div>
            </div>
            <!-- 右上角关闭按钮 -->
            <button :class="['absolute top-2 left-2 text-white p-5 text-sm', Account.data.loginMethod === LoginMethod.PHONE? 'login-with-qrcode' : 'login-with-phone']" @click="Account.methods.toggleLoginMethod"/>
            <div class='absolute top-2 right-2 text-balck p-2 text-sm login-close w-[30px] h-[30px] cursor-pointer' @click="close"/>
        </div>
    </div>
</template>

<script lang="ts">
import { SetupContext, ref, onMounted, onUnmounted, watch } from "vue"
import QRCode from 'qrcode'
import { Account, LoginMethod, Router, RouterPath } from '@/store/index'
import UserRegister  from '../UserRegister/index.vue'
import { ipcRenderer } from 'electron'
import { ObEvent } from "@common/";
import { nextTick } from 'process'

export default {
  name: "UserLogin",
  props: {},

  emits: [],
  components: { UserRegister },

  setup(props: any, context: SetupContext) {

    const url = ref("")
    const curLoginMethod = ref(LoginMethod.WECHAT)
    const phoneNum = ref('')
    const smsCode = ref('')

    const countryCode = ref('+86')

    let qrcodeTimer: NodeJS.Timeout | null = null

    let prompt = ref('获取验证码')

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

        ipcRenderer.send(ObEvent.WINDOW_RESIZE, { width: 1069, height: 602 })

        Account.methods.loginWithToken().then((isSuccess: boolean) => {
            if(!isSuccess){
                // 登录过期
                loading.value = false
            }else{
                Router.methods.to(RouterPath.MAIN)
                ipcRenderer.send(ObEvent.WINDOW_RESIZE, { width: 1920, height: 1080, center: true })
            }
        })

    })

    onUnmounted(() => {
        if(qrcodeTimer){
            clearInterval(qrcodeTimer)
        }
    })

    function close(){
        ipcRenderer.send(ObEvent.APP_FORCE_QUIT, '')
    }

    let time = 60

    async function sendPhoneVerificationCode(phone: string){
        if(time != 60){
            return
        }

        Account.methods.sendPhoneVerificationCode(phone)
        let id = setInterval(() => {
            prompt.value = `${time--}s`
            if(time == 0){
                clearInterval(id)
                time = 60
                prompt.value = '获取验证码'
            }
        }, 1000)
    }

    async function loginWithPhoneNum(phoneNum: string, smsCode: string){
        // TODO: 处理验证码输入错误的情况
        // TODO: 处理点击发送验证码，然后验证码开始倒计时
        const user_profile = await Account.methods.loginWithPhoneNum(phoneNum, smsCode)
        if(user_profile){
            Router.methods.to(RouterPath.MAIN)
            ipcRenderer.send(ObEvent.WINDOW_RESIZE, { width: 1920, height: 1080, center: true })
        }
    }

    watch(() => Account.data.loginMethod, (newValue) =>{
        if(Account.data.loginMethod === LoginMethod.WECHAT){
            nextTick(() => {
                let timer = setInterval(() => {
                    const webview = document.querySelector("webview") as any;
                    if(webview){
                        webview.reload()
                        clearInterval(timer)
                    }else{
                        return
                    }
                    
                    qrcodeTimer = setInterval(() => {
                        webview.reload()
                    }, 15000)
                    webview.addEventListener('dom-ready', async () => {
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
                        Router.methods.to(RouterPath.MAIN)
                        // TODO: 登录成功之后，修改窗口大小及位置
                        ipcRenderer.send(ObEvent.WINDOW_RESIZE, { width: 1920, height: 1080, center: true })
                    })
                }, 100)
            })
        }else{
            if(qrcodeTimer){
                clearInterval(qrcodeTimer)
            }
        }
    }, { immediate: true, deep: true })

    return { prompt, countryCode, close, loading, Account, LoginMethod, sendPhoneVerificationCode, loginWithPhoneNum, url, curLoginMethod, phoneNum, smsCode }
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

.login-close{
    background: url('@/assets/images/Swifaigo/login-close.png');
}
</style>
