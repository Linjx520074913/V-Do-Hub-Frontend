<template>
    <div class="home-page-root">
        <div class="left">
            <div class="logo"/>
            <div class="menu">
                <div v-for="item in Menu.data.slider" :class="[ item.visible? 'item': 'hidden' ]" >
                    <div :class="['content', Menu.methods.isActived(item) ? 'highlight': '']" @click="Menu.methods.active(item)">
                        <span :class="['icon', item.icon]" />
                        <span class="title">{{ item.title }}</span>
                    </div>
                    <span :class="[ Menu.methods.isActived(item) ? 'right-border': '']" />
                </div>
            </div>
        </div>
        <div class="middle">
            <div class="infomation-bar flex flex-row items-center justify-between">
                <div class="navi">
                    <div class="name w-10">{{ Menu.data.activedItem.title }}</div>
                    <div class="free" v-show='Menu.data.activedItem.visible' @click="Menu.methods.activeAccountZone"> Free </div>
                </div>
                <ObDropdownMenu class="flex flex-col justify-center mr-8" :items="dropdownItems"/>
            </div>
            <RouterView />
        </div>
    </div>
</template>

<script lang="ts">
import { Menu } from "@/store/index"
import { showAccountZone } from './index'
import { ObDropdownMenu } from '@/common/templates/index'
import { ref } from 'vue'
import { Account, LoginMethod } from '@/store/index'
import { router, RouterPath } from '@/main'

export default {
    name: "HomePage",
    props: {},

    emits: [],
    components: { ObDropdownMenu },

    setup(props: any, context: any) {
        const dropdownItems = ref([
            { 
                text: '设置', 
                click: () => { 
                    console.log('设置1')
                    router.push(`${RouterPath.MAIN}/${RouterPath.USER_ZONE}`)
                } 
            },
            { 
                text: '登出', 
                click: () => { 
                    Account.methods.logout()
                } 
            }
        ])
        return {
            Menu,
            showAccountZone,
            dropdownItems
        };
    },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";

</style>
