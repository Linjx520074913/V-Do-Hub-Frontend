import { ref } from 'vue'
import { router, RouterPath } from '@/main'
import { AXIOS } from '@/api/index'
import path from 'path'
import { LocalStorage } from '@/components'

interface UserProfile{
    userId: string,
    name: string,
    phone: string,
    email: string
    productCategory: string[],
    createdAt: Date,
    updatedAt: Date,
    isRegistered: boolean,
    isMember: boolean,
    membershipStartDate: Date,
    membershipEndDate: Date,
}

interface Response{
    data:{
        message: string,
        code: string
    },
    status: number,
    statusText: string
}

// 订阅
interface Subscription{
    planId: string,
    name: string,
    description: string,
    price: number
}

enum URL{
    LOGIN_WECHAT            = '/api/auth/login/wechat',
    USER_PROFILE            = '/api/user/profile',
    PHONE_VERIFICATION_CODE = '/api/auth/validation/phone/send-verification-code',
    EMAIL_VERIFICATION_CODE = '/api/auth/validation/email/send-verification-code',
    LOGIN_PHONE             = '/api/auth/login/phone',
    USER_REGISTER           = '/api/user/register',
    USER_SUBSCRIPTIONS      = '/api/user/subscriptions',
    PAYMENT                 = '/api/user/subscribe/payment'
}

enum LoginMethod{
    WECHAT = 0,
    PHONE
}

enum PaymentMethod{
    WECHAT = 'wechat', // 微信
    ALIPAY = 'alipay'  // 支付宝
}

const AccountRef = ref({
    data:{
        curUser: {
            userId: '',
            name: '',
            phone: '',
            email: '',
            productCategory: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            isRegistered: false,
            isMember: false,
            membershipStartDate: new Date(),
            membershipEndDate: new Date()
        } as UserProfile,
        curToken: '',
        curSmsCode: '',
        isLogin: false,
        needRegister: false,
        loginMethod: LoginMethod.WECHAT,
        wechatURL: 'https://open.weixin.qq.com/connect/qrconnect?appid=wxa0d29e126c88138a&redirect_uri=http%3A%2F%2Fwww.swifaigo.cn&response_type=code&scope=snsapi_login&state=123456789#wechat_redirect'
    },
    methods:{
        /**
         * 切换登录方式
         */
        toggleLoginMethod(){
            switch(Account.data.loginMethod){
                case LoginMethod.WECHAT:
                    Account.data.loginMethod = LoginMethod.PHONE
                    break
                case LoginMethod.PHONE:
                    Account.data.loginMethod = LoginMethod.WECHAT
                    break
                default:
                    break
            }
        },

        /**
         * 发送手机验证码
         * @param phoneNum 手机号码
         * @returns 
         */
        async sendPhoneVerificationCode(phoneNum: string): Promise<string>{
            const formData = new URLSearchParams();
            formData.append('phone', phoneNum);
            const res = await AXIOS.request({
                method: 'POST',
                url: URL.PHONE_VERIFICATION_CODE,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: formData
            })
            const { data, status, statusText } = res
            const response: Response = {
                data,
                status,
                statusText
            }
            // TODO: 处理失败的情况
            console.log("[ Account ] sendPhoneVerificationCode : ", response)
            Account.data.curSmsCode = response.data.code
            return response.data.code
        },

        /**
         * 发送邮件验证码
         * @param email 邮件地址
         */
        async sendEmailVerificationCode(email: string): Promise<string>{
            const formData = new URLSearchParams();
            formData.append('email', email);
            const res = await AXIOS.request({
                method: 'POST',
                url: URL.EMAIL_VERIFICATION_CODE,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: formData
            })
            
            const { data, status, statusText } = res
            const response: Response = {
                data,
                status,
                statusText
            }
            // TODO: 处理失败的情况
            console.log("[ Account ] sendEmailVerificationCode : ", response)
            return response.data.code
        },

        /**
         * 手机号码登录
         * @param phoneNum 
         * @param smsCode 
         * @returns token, 根据该 token 获取用户信息
         */
        async getTokenWithPhoneNum(phoneNum: string, smsCode: string): Promise<string>{
            const data = new URLSearchParams();
            data.append('phone', phoneNum);
            data.append('code', smsCode)
            const res = await AXIOS.request({
                method: 'POST',
                url: URL.LOGIN_PHONE,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: data
            })
            console.log("[ Account ] loginWithPhoneNum ", res)
            return res.data.token
        },

        /**
         * 根据 code 获取微信授权 token
         * @param code 通过扫描二维码，二维码跳转成功之后会携带 code 返回
         */
        async getTokenWithCode(code: string): Promise<string>{
            const res = await AXIOS.request({
                method: 'POST',
                url: URL.LOGIN_WECHAT,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                params: {
                    code: code
                }
            })
            // TODO: 处理失败的情况
            return res.data.token
        },

        /**
         * 根据 token 查询用户信息
         * @param token 
         * @returns 
         */
        async getUserProfileByToken(token: string): Promise<UserProfile | undefined>{
            if(!token){
                token = Account.data.curToken
            }

            try{
                const res = await AXIOS.request({
                    method: 'GET',
                    url: URL.USER_PROFILE,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                })
                // TODO: 处理获取失败的情况
                Account.data.curUser  = res.data
                Account.data.curToken = token
    
                LocalStorage.methods.set('token', token)
                console.log("[ Account ] getUserProfileByToken : ", Account.data.curUser)
             
                return res.data
            }catch(err){
                return undefined
            }
        },
        logout(){
            LocalStorage.methods.set('token', '')
            Account.data.isLogin = false
            Account.data.needRegister = false
            Account.data.curSmsCode = ''
            console.log('QQQQQQQQQQQQQQQQQQQQQQQQQQQ', Account.data.isLogin)
            // TODO：这个地方跳转有问题
            // router.push(`${RouterPath.MEDIA_LIBRARY}`)
        },
        /**
         * 用缓存的 token 进行登录
         * @returns 登录成功返回 true, 否则返回 false
         */
        async loginWithToken(): Promise<boolean>{
            const token = LocalStorage.methods.get('token') as string
            const user_profile = await Account.methods.getUserProfileByToken(token)
            Account.data.isLogin = user_profile != undefined
            return user_profile != undefined
        },
        
        /**
         * 用户是否已经注册
         * @param user_profile 
         */
        isRegistered(user_profile: UserProfile | undefined){
            Account.data.isLogin = user_profile != undefined && user_profile.isRegistered
            Account.data.needRegister = !(user_profile as any).isRegistered
            if(!user_profile){
                return
            }
        },

        /**
         * 手机号登录
         * @param phoneNum 
         * @param smsCode 
         * @returns 
         */
        async loginWithPhoneNum(phoneNum: string, smsCode: string): Promise<UserProfile | undefined> {
            const token        = await Account.methods.getTokenWithPhoneNum(phoneNum, smsCode)
            const user_profile = await Account.methods.getUserProfileByToken(token)
            Account.methods.isRegistered(user_profile)
            console.log('[ Account ] loginWithPhoneNum : ', phoneNum, smsCode, user_profile)
            return user_profile
        },

        /**
         * 微信登录
         * @param code 
         * @returns 
         */
        async loginWithWechat(code: string){
            const token        = await Account.methods.getTokenWithCode(code)
            const user_profile = await Account.methods.getUserProfileByToken(token)
            Account.methods.isRegistered(user_profile)
            console.log('[ Account ] loginWithWechat : ', code)
            return user_profile
        },

        /**
         * 用户注册
         * @param email 
         * @param company 
         * @param productCategory 
         * @returns 成功返回 true，失败返回 false 
         */
        async register(email: string, company: string, productCategory: string[], phoneNum?: string, smsCode?: string): Promise<boolean>{
            console.log('##########register', email, company, productCategory)
            const data = new URLSearchParams();
            productCategory.forEach((category) => { console.log('afsafa', category); data.append('productCategory', category)} );
            data.append('email',           email);
            data.append('company',         company)
            if(Account.data.loginMethod == LoginMethod.WECHAT){
                if(phoneNum){
                    data.append('phone', phoneNum)
                }
                if(smsCode){
                    data.append('verification_code', smsCode)
                }
            }
            
            const res = await AXIOS.request({
                method: 'POST',
                url: URL.USER_REGISTER,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${Account.data.curToken}`
                },
                data: data
            })
            console.log("[ Account ] loginWithPhoneNum ", res)
            
            Account.data.isLogin = res.status == 200

            return res.status == 200
        },
        /**
         * 获取订阅
         * @returns 
         */
        async getSubscriptions(): Promise<[]>{
            const res = await AXIOS.request({
                method: 'GET',
                url: URL.USER_SUBSCRIPTIONS,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${Account.data.curToken}`
                }
            })


            console.log('@@@@@@@@@@@@@@@ getSubscriptions @@@@@@@@@@@@@@', res)
            // TODO: 处理异常
            return res.data
        },
        async createPaymentOrder(planId: string, paymentMethod: PaymentMethod){
           console.log('@@@@@@@@@@@@@', planId, paymentMethod)
            const data = new URLSearchParams();
            data.append('subscriptionPlan', planId);
            data.append('paymentMethod',    paymentMethod)
            
            const res = await AXIOS.request({
                method: 'POST',
                url: URL.PAYMENT,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${Account.data.curToken}`
                },
                data: data
            })
            // TODO: 处理异常
            console.log("[ Account ] createPaymentOrder ", res)
            return res.data
        }
    }
})

const Account = AccountRef.value

export { Account, LoginMethod, PaymentMethod }