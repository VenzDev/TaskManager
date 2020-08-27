<template>
  <div class="column">
    <h2 class="columnName">{{ columnName }}</h2>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Column extends Vue {
  @Prop() columnName!: string;
}
</script>

<style lang="scss" scoped>
@import "@/styles/config.scss";
.column {
  flex: 0 0 18%;
  border-radius: 6px;
  background-color: $color-light;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);

  @media (max-width: 1000px) {
    flex: 0 0 250px;
    margin-right: 20px;
  }

  & .columnName {
    cursor: grab;
    padding: 1rem;
  }
}
</style>
