<template>
  <div id="client-template">
    <!-- Header Bar -->
    <div id="header">
      <slot name="header" />
    </div>

    <!-- Main Switchable Section -->
    <div id="main">
      <slot name="main" />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "ClientTemplate",
};
</script>

<style lang="scss" scoped>
@import "./local.scss";
</style>
