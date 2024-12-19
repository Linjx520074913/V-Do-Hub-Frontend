<template>
    <div class="registration-container">
        <h2>用户注册</h2>
        <form @submit.prevent="submitForm">
            <!-- 客户手机号 -->
            <div class="form-group">
                <label for="phone">{{ loginMethodTitle }} </label>
                <input 
                    type="text"
                    v-model="Account.data.curUser.name" 
                    :disabled="true"
                />
            </div>
            <div class="form-group" v-if="Account.data.loginMethod == LoginMethod.WECHAT">
                <div class="flex-1">
                    <label for="phone" class="block text-lg font-semibold text-gray-800">手机号码</label>
                    <div class="flex flex-row justify-center items-center">
                        <input 
                        type="text" 
                        id="phone"
                        v-model="phoneNum"
                        placeholder="请输入手机号码"
                        class="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out hover:border-blue-400"
                        />
                        <el-button 
                            type="primary" 
                            @click="sendPhoneVerificationCode(phoneNum)"
                            class="w-32 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-600 transition duration-300 ease-out transform hover:scale-105 focus:ring-2 focus:ring-blue-500"
                        >
                            获取验证码
                        </el-button>
                    </div>
                </div>
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
            </div>
    
            <!-- 公司名称 -->
            <div class="form-group">
                <label for="company">公名称（选填）</label>
                <input 
                    type="text" 
                    id="company" 
                    v-model="form.company" 
                    placeholder="请输入公司名称" 
                />
            </div>
    
            <!-- 邮箱 -->
            <div class="form-group">
            <label for="email">邮箱（选填）</label>
            <input 
                type="email" 
                id="email" 
                v-model="form.email" 
                placeholder="请输入邮箱" 
            />
            </div>
    
            <!-- 商品品类 -->
            <div class="form-group">
            <label>商品品类</label>
            <div class="checkbox-group">
                <label v-for="(category, index) in categories" :key="index">
                <input 
                    type="checkbox" 
                    :value="category" 
                    v-model="form.selectedCategories" 
                />
                {{ category }}
                </label>
            </div>
    
            <!-- 如果选择了“其他”，显示备注说明 -->
            <textarea 
                v-if="form.selectedCategories.includes('其他')" 
                v-model="form.otherCategory" 
                placeholder="备注说明" 
            />
            </div>
    
            <!-- 提交按钮 -->
            <div class="form-group">
            <button type="submit">提交</button>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import { SetupContext, ref, computed } from "vue"
import { Account, LoginMethod } from '@/store/index'
import { router, RouterPath } from '@/main'

import { ElMessage } from 'element-plus';


export default {
    name: "UserRegister",
    props: {},

    emits: [],
    components: {},

    setup(props: any, context: SetupContext) {
        
        const phoneNum = ref('15019456440')
        const smsCode = ref(Account.data.curSmsCode)
        const form = ref({
            company: '',
            email: '',
            selectedCategories: [] as string[],  // 用于存储勾选的商品品类
            otherCategory: '' as string      // 备注说明
        })
        const categories = ref(['珠宝', '美妆', '饰品', '陶瓷', '电子产品', '其他'])
        async function submitForm() {
            if (form.value.selectedCategories.length == 0) {
                alert('珠宝是必选项，请选择珠宝！');
                return;  // 阻止表单提交
            }
            // 进行提交操作
            console.log('提交的表单数据:', form.value);
            // 这里可以调用API提交表单...
            
            const isSuccess = await Account.methods.register(form.value.email, form.value.company, form.value.selectedCategories, phoneNum.value, smsCode.value)
            
            // if(isSuccess){
            //     // 成功跳转到首页
            //     router.push(`${RouterPath.MAIN}/${RouterPath.MEDIA_CAPTURE}`)    
            // }else{
            //     // TODO：失败
                
            // }
            ElMessage({
                message: isSuccess? '注册成功!' : '注册失败',
                type: isSuccess? 'success' : 'error',
            });
        }

        async function sendPhoneVerificationCode(phone: string){
            smsCode.value = await Account.methods.sendPhoneVerificationCode(phone)
        }

        const loginMethodTitle = computed(() => {
            return Account.data.loginMethod == LoginMethod.WECHAT ? '微信号' : '手机号'
        })

        return { phoneNum, smsCode, sendPhoneVerificationCode, form, categories, submitForm, Account, LoginMethod, loginMethodTitle }
    },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
.registration-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  margin-bottom: 2px;
  font-size: 14px;
}

.form-group input, 
.form-group select, 
.form-group textarea {
  width: 100%;
  padding: 5px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
}

.form-group button {
  width: 100%;
  padding: 12px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.form-group button:hover {
  background-color: #0056b3;
}
</style>
