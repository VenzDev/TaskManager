<template>
  <Wrapper>
    <router-view class="container" />
  </Wrapper>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import tasks from "@/store/modules/tasks";
import Wrapper from "@/components/Wrapper.vue";

@Component({ components: { Wrapper } })
export default class App extends Vue {
  created() {
    tasks.getTasksFromLocalStorage();
  }
}
</script>
<style lang="scss">
@import "@/styles/app.global.scss";
</style>
