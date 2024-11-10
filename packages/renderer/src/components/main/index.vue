<template>
    <div id="client">
        <Header class="header header-bg dragable" />
        <div id="app-main">
            <HomePage />
        </div>
        <Footer class="footer" />
    </div>
</template>

<script>
import Header from "@components/header/index.vue";
import Footer from "@components/footer/index.vue";
import { init } from "@components/index";
import { mount } from "./index";

import { HomePage } from "@/views/index"
import { ipcRenderer } from 'electron';
import { router } from '@/main'

export default {
    name: "Main",

    components: { Header, Footer, HomePage },

    setup() {
        // TODO: replace 'WECHAT-LOGIN-SUCCESS' with constant
        ipcRenderer.on("WECHAT-LOGIN-SUCCESS", (event, code) => {
          router.push(`/Setting?code=${code}`);
        });

        init();
        mount();
        return {};
    },
};
</script>
<style lang="scss">
@import "./index.scss";
</style>
