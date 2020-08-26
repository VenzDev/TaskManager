<template>
  <div class="app">
    <header class="header">
      <p><i class="fas fa-sticky-note"></i> Task Manager</p>
    </header>
    <router-view class="container" />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import tasks from "@/store/modules/tasks";

@Component
export default class App extends Vue {
  created() {
    tasks.getTasksFromLocalStorage();
  }
}
</script>
<style lang="scss">
@import "@/styles/app.global.scss";
@import "@/styles/config.scss";
.app {
  background: #00afff;
  background-image: linear-gradient(to bottom, #3a86ff, #009cff, #00afff, #00bff7, #12cdeb);
}
.header {
  height: 50px;
  background-color: transparent;
  & p {
    font-family: "Montserrat";
    color: white;
    font-size: 2rem;
    margin-left: 2rem;
    font-weight: bold;
    line-height: 50px;
  }
}
.container {
  min-height: calc(100vh - 50px);
}
</style>
