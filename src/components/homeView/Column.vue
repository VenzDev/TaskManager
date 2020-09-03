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
  background-color: $color-white;
  box-shadow: 10px 20px 30px 0 $color-colShadow;

  @media (max-width: 1000px) {
    flex: 0 0 250px;
    margin-right: 20px;
  }

  .columnName {
    font-weight: normal;
    cursor: grab;
    padding: 1rem;
    border-bottom: 1px solid $color-light;
  }
}
</style>
