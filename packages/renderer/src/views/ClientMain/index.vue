<template>
    <HomePage class="checkerboard" />
</template>

<script lang="ts">
import { HomePage } from "./components/index";

export default {
    name: "ClientMain",

    components: {
        HomePage,
    },

    setup() {
        return {
        };
    },
};
</script>

<style lang="scss" scoped>
    @import "./local.scss";
</style>

<style lang="scss">
    @import "@/common/styles/global.scss";
</style>
