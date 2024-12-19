<template>
    <div class="p-5 h-full w-full">
        <div class="flex flex-col h-full">
            <div class="flex flex-row mb-4">
                <div :class="['mr-4', 'text-sm', selected.text == item.text? 'bg-red-500':'']" 
                v-for="(item, index) in navItem" :key="index" @click="activeNavItem(item)">
                {{ item.text }}
            </div>
            </div>
            
            <keep-alive>
                <component :is="selected.component"/>
            </keep-alive>
        </div>
        <!-- <MemberShip/>
        <UserInfo/> -->
    </div>
</template>

<script lang="ts">
import { SetupContext, ref } from "vue"
import MemberShip from './MemberShip/index.vue'
import UserInfo from './UserInfo/index.vue'

export default {
  name: "UserZone",
  props: {},

  emits: [],
  components: { MemberShip, UserInfo },

  setup(props: any, context: SetupContext) {
    const navItem = ref([
        { text: '账户信息', component: UserInfo },
        { text: '订阅',     component: MemberShip }
    ])
    const selected = ref(navItem.value[0])
    function activeNavItem(item: any){
        console.log('AFFFFF', item)
        selected.value = item
    }
    return { navItem, selected, activeNavItem }
  },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
</style>
