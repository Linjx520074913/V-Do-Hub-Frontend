<template>
    <div class="flex-1">
        <div id="app-main" class="flex flex-col h-full">
            <Header class="dragable"/>
            <div class="flex-1 flex justify-center items-center">
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script>
import Header from "@components/header/index.vue";
import Footer from "@components/footer/index.vue";
import { init } from "@components/index";
import { mount } from "./index";

import { HomePage } from "@/views/index"
import { onMounted } from 'vue';
import { Account, Router } from '@/store/index'
import { RouterPath } from '../../store';

export default {
    name: "Main",

    components: { Header, Footer, HomePage },

    setup() {

        onMounted(() => {
            Router.methods.to(Account.data.needRegister? RouterPath.USER_REGISTER : RouterPath.HOMEPAGE)
        })

        init();
        mount();
        return {};
    },
};
</script>
<style lang="scss">
@import "./index.scss";
</style>
