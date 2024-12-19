<template>
    <div class="w-full h-full flex-1">
        <p>个人信息</p>
        <div class="w-full h-full flex flex-row mt-5">
            <div class="flex-1">
                <p>名字</p>
                <input/>
                <p>电子邮件</p>
                <input/>
                <p>公司名称</p>
                <input/>
            </div>
            <div class="flex-1">
                <p>电话号码</p>
                <input/>
                <p>公司网站链接</p>  
                <input/>
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
    return {};
  },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
</style>
