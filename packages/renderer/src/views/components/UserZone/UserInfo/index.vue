<template>
    <div class="w-full h-full flex flex-col mt-5">
        <p>用户名</p>
        <input/>
        <p>手机号码*</p>
        <input/>
        <p>公司名称</p>
        <input/>
        <p>电子邮件</p>
        <input/>
        <p>商品品类*</p>
        <div class="flex flex-row space-x-3">
            <div v-for="(item, index) in options" :key="index" class="flex flex-row items-center">
                <input 
                    type="checkbox" 
                    id="icon-checkbox" 
                    class="appearance-none w-[20px] h-[20px] bg-gray-200 checked:bg-[#E94902] checked:border-transparent focus:ring-bg-[#E94902] relative 
                    before:content-['✔'] before:absolute before:inset-0 before:flex before:justify-center before:items-center before:text-white before:opacity-0 checked:before:opacity-100"
                />
                <label for="icon-checkbox" class="ml-2 text-[16px]">{{ item.title }}</label>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { SetupContext } from "vue"

export default {
  name: "UserInfo",
  props: {},

  emits: [],
  components: {},

  setup(props: any, context: SetupContext) {

    const options = [
        { title: '珠宝' },
        { title: '美妆' },
        { title: '饰品' },
        { title: '陶瓷' },
        { title: '电子产品' },
        { title: '其他产品' }
    ]

    return { options };
  },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
</style>
