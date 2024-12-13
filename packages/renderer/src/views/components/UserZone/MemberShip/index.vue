<template>
  <div class="border-2 border-blue-600 w-full h-full flex flex-row p-4 gap-x-2">
    <div class="flex-1 border-2 border-red-300">
        info
    </div>
    <div class="flex-1 bg-white border-2 border-red-300 rounded-lg flex flex-col justify-center items-center">
        <div class="border-2 border-black w-auto">
            <div class="flex flex-row justify-center items-center">
                <span class="icon-camera text-indigo-400"/>
                <p>Free</p>
            </div>
            <p class="text-xl">$0/mo</p>
            <el-button>当前计划</el-button>
        </div>
        <div class="border-2 border-black w-1/3">
            bot
        </div>
    </div>
    <div class="flex-1 bg-white border-2 border-red-300 rounded-lg flex flex-col justify-center items-center">
        <div class="border-2 border-black w-auto">
            <div class="flex flex-row justify-center items-center">
                <span class="icon-camera text-indigo-400"/>
                <p>Upgrade</p>
            </div>
            <p class="text-xl">$0/mo</p>
            <el-button>当前计划</el-button>
        </div>
        <div class="border-2 border-black w-1/3">
            bot
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import { SetupContext } from "vue"

export default {
  name: "MemberShip",
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
