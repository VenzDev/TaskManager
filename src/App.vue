<template>
  <div id="app">
    <header class="header">header</header>
    <router-view class="container" />
  </div>
</template>

<style lang="scss">
@import "@/styles/app.global.scss";
@import "@/styles/config.scss";

.header {
  height: 50px;
  border-bottom: 1px solid gray;
  background-color: $color-light;
}
.container {
  background-color: $color-blue;
  min-height: calc(100vh - 50px);
}
</style>
