<template>
  <div class="app">
    <Header />
    <slot class="container" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Header from "@/components/Header.vue";

@Component({ components: { Header } })
export default class Wrapper extends Vue {}
</script>

<style lang="scss" scoped>
.app {
  background: #00afff;
  background-image: linear-gradient(to bottom, #3a86ff, #009cff, #00afff, #00bff7, #12cdeb);
}

.container {
  min-height: calc(100vh - 50px);
}
</style>
