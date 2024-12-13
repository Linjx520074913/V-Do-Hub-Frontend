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
            <div class="infomation-bar flex flex-row items-center">
                <div class="navi">
                    <div class="name">{{ Menu.data.activedItem.title }}</div>
                    <div class="free" v-if='Menu.data.activedItem.visible' @click="Menu.methods.activeAccountZone"> Free </div>
                </div>
                <ObDropdownMenu/>
            </div>
            <RouterView />
        </div>
    </div>
</template>

<script lang="ts">
import { Menu } from "@/store/index"
import { showAccountZone } from './index'
import { ObDropdownMenu } from '@/common/templates/index'

export default {
    name: "HomePage",
    props: {},

    emits: [],
    components: { ObDropdownMenu },

    setup(props: any, context: any) {
        document.addEventListener("DOMContentLoaded", function () {
            const trigger = document.getElementById("dropdown-trigger") as any;
            const menu = document.getElementById("dropdown-menu") as any;

            trigger.addEventListener("click", function (event: any) {
                event.stopPropagation(); // 阻止事件冒泡
                menu.classList.toggle("hidden");
            });

            // 点击其他地方关闭菜单
            document.addEventListener("click", function () {
                menu.classList.add("hidden");
            });
        });
        return {
            Menu,
            showAccountZone
        };
    },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";

</style>
