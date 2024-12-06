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

export default {
    name: "UserRegister",
    props: {},

    emits: [],
    components: {},

    setup(props: any, context: SetupContext) {
        const form = ref({
            company: '',
            email: '',
            selectedCategories: [],  // 用于存储勾选的商品品类
            otherCategory: ''        // 备注说明
        })
        const categories = ref(['珠宝', '美妆', '饰品', '陶瓷', '电子产品', '其他'])
        function submitForm() {
            if (form.value.selectedCategories.length == 0) {
                alert('珠宝是必选项，请选择珠宝！');
                return;  // 阻止表单提交
            }

            // 进行提交操作
            console.log('提交的表单数据:', form.value);
            // 这里可以调用API提交表单...
        }

        const loginMethodTitle = computed(() => {
            return Account.data.loginMethod == LoginMethod.WECHAT ? '微信号' : '手机号'
        })

        return { form, categories, submitForm, Account, LoginMethod, loginMethodTitle }
    },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
.registration-container {
  width: 100%;
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
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-group input, 
.form-group select, 
.form-group textarea {
  width: 100%;
  padding: 10px;
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
