<template>
    <div class="login-container">
        <div class="login-methods">
            <button @click="switchMethod('phone')" :class="{ active: loginMethod === 'phone' }">手机登录</button>
            <button @click="switchMethod('weixin')" :class="{ active: loginMethod === 'weixin' }">微信登录</button>
        </div>

        <div v-if="loginMethod === 'phone'" class="login-form">
            <input type="text" v-model="phone" placeholder="请输入手机号码" />
            <input type="password" v-model="password" placeholder="请输入密码" />
            <button @click="loginWithPhone">登录</button>
        </div>

        <div v-else-if="loginMethod === 'weixin'" class="login-form">
            <button @click="loginWithWeixin">使用微信登录</button>
        </div>
    </div>
</template>

<script lang="ts">
import { SetupContext, ref } from "vue"

export default {
  name: "Login",
  props: {},

  emits: [],
  components: {},

  setup(props: any, context: SetupContext) {
    const loginMethod = ref('weixin')
        const phone = ref('')
        const password = ref('')

        function switchMethod(value: string) {
            loginMethod.value = value;
        }

        function loginWithPhone() {
            // 实现手机登录的逻辑
            console.log('手机登录:', phone.value, password.value);
        }

        function loginWithWeixin() {
            // 实现微信登录的逻辑
            console.log('微信登录')
        }

        return { loginMethod, phone, password, switchMethod, loginWithPhone, loginWithWeixin }
  },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
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
