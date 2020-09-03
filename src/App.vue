<template>
  <Wrapper>
    <transition name="fade" mode="out-in">
      <router-view class="container" />
    </transition>
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

.container {
  min-height: calc(100vh - 50px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
