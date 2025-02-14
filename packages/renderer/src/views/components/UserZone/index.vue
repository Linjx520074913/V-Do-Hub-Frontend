<template>
    <div class="h-full w-full">
        <div class="flex flex-col h-full ml-[64px]">
            <div class="flex flex-row">
                <div :class="['mr-4 text-[24px] cursor-pointer', selected.text == item.text? 'text-[#E94902]':'']" 
                    v-for="(item, index) in navItem" :key="index" @click="activeNavItem(item)">
                    {{ item.text }}
                </div>
            </div>

            <span class="border border-[#A7A7A7] w-full mt-3"/>
            
            <keep-alive>
                <component :is="selected.component"/>
            </keep-alive>
        </div>
    </div>
</template>

<script lang="ts">
import { SetupContext, ref, onMounted } from "vue"
import MemberShip from './MemberShip/index.vue'
import UserInfo from './UserInfo/index.vue'
import { useRoute, useRouter  } from 'vue-router';

export default {
    name: "UserZone",
    props: { 
        params: {
            type: Object
        }
    },

    emits: [],
    components: { MemberShip, UserInfo },

    setup(props: any, context: SetupContext) {
        let route = useRoute()
        let router = useRouter()
        const activedIndex = route.query.index as any
        
        const navItem = ref([
            { text: '账户信息', component: UserInfo },
            { text: '会员',     component: MemberShip }
        ])
        const selected = ref(navItem.value[activedIndex as number])
        function activeNavItem(item: any){
            selected.value = item
        }
        router.afterEach((to: any, from: any) => {
            let index = route.query.index as any
            activeNavItem(navItem.value[index as number])
        });
        onMounted(() => {

        })
        return { navItem, selected, activeNavItem }
    },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
</style>
