import { ref } from 'vue'
import { router } from '@/main'
import { AXIOS } from '@/api/index'

interface UserProfile{
    userId: string,
    name: string,
    isMember: false,
    membershipStartDate: Date,
    membershipEndDate: Date,
    createdAt: Date,
    updatedAt: Date,
    email: string,
    phone: string
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
    feature: Object
}

enum URL{
    LOGIN_WECHAT      = '/api/auth/login/wechat',
    USER_PROFILE      = '/api/user/profile',
    VERIFICATION_CODE = '/api/auth/validation/phone/send-verification-code',
    LOGIN_PHONE       = '/api/auth/login/phone',
    USER_REGISTER     = '/api/user/register'
}

enum LoginMethod{
    WECHAT = 0,
    PHONE
}

const AccountRef = ref({
    data:{
        curUser: {},
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
        async sendVerificationCode(phoneNum: string): Promise<string>{
            const formData = new URLSearchParams();
            formData.append('phone', phoneNum);
            const res = await AXIOS.request({
                method: 'POST',
                url: URL.VERIFICATION_CODE,
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
            console.log("[ Account ] sendVerificationCode : ", response)
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
        async getUserProfileByToken(token: string): Promise<UserProfile>{
            const res = await AXIOS.request({
                method: 'GET',
                url: URL.USER_PROFILE,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            })
            // TODO: 处理获取失败的情况
            Account.data.curUser = res.data
            console.log("[ Account ] getUserProfileByToken : ", Account.data.curUser)
         
            // 判断用户是否注册
            if(res.data.email){
                // 用户已注册
                
            }else{
                // 用户未注册，跳转到用户信息页
                router.push('/UserRegister')
            }
         
            return res.data
        },

        /**
         * 手机号登录
         * @param phoneNum 
         * @param smsCode 
         * @returns 
         */
        async loginWithPhoneNum(phoneNum: string, smsCode: string): Promise<UserProfile> {
            const token        = await Account.methods.getTokenWithPhoneNum(phoneNum, smsCode)
            const user_profile = await Account.methods.getUserProfileByToken(token)
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
            console.log('[ Account ] loginWithWechat : ', code)
            return user_profile
        },
        
        async register(email: string, industry: string, others: string){
            const data = new URLSearchParams();
            data.append('email',    email);
            data.append('industry', industry)
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
        }
    }
})

const Account = AccountRef.value

export { Account, LoginMethod }