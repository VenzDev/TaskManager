<template>
  <div class="app">
    <Header />
    <slot />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Header from "@/components/Header.vue";

@Component({ components: { Header } })
export default class Wrapper extends Vue {}
</script>

<style lang="scss" scoped>
@import "@/styles/config.scss";
.app {
  background-color: $color-body;
}
</style>
