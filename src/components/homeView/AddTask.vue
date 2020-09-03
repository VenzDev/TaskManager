<template>
  <div class="addTask">
    <SmoothHeight>
      <p class="addIcon" v-if="selectedColumnId !== columnId" @click="selectColumnId(columnId)">
        <i class="fas fa-plus"></i>
      </p>
      <div class="addContainer" v-else>
        <div class="addInput">
          <input placeholder="Nowe zadanie" v-model="newTask" type="text" />
          <div class="inputBorder"></div>
        </div>
        <div class="addButtons">
          <p @click="createNewTask"><i class="fas fa-check"></i></p>
          <p @click="closeCreateTaskInput"><i class="fas fa-times"></i></p>
        </div>
      </div>
    </SmoothHeight>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import tasks from "@/store/modules/tasks";
import SmoothHeight from "@/components/smoothHeight.vue";

@Component({ components: { SmoothHeight } })
export default class AddTask extends Vue {
  @Prop() columnId!: number;
  @Prop() selectedColumnId!: number;
  @Prop() columnOrder!: number;
  @Prop() selectColumnId!: Function;

  newTask: string | null = null;

  createNewTask() {
    if (this.newTask && this.newTask.trim()) {
      tasks.createTask({ columnOrder: this.columnOrder, text: this.newTask });
      this.selectColumnId(null);
      this.newTask = null;
    }
  }

  closeCreateTaskInput() {
    this.selectColumnId(null);
    this.newTask = null;
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/config.scss";

.addTask {
  border-top: 1px solid lightgray;
  padding: 0.5rem;
  text-align: center;

  > div {
    transition: 0.5s;
    max-height: 400px;
  }

  .addIcon {
    font-size: 1.5rem;
    transition: 0.2s;
    cursor: pointer;

    &:hover {
      color: $color-blue;
    }
  }

  > p {
    cursor: pointer;
  }

  .addContainer {
    width: 80%;
    display: flex;
    flex-wrap: wrap;
    margin: 0 auto;

    .addInput {
      width: 100%;
      padding: 1px;
      position: relative;
      background: $color-light;
      z-index: 1;
      border-radius: 6px;
      overflow: hidden;
      margin: 1rem 0;

      input {
        width: 100%;
        color: blue;
        height: 30px;
        box-sizing: border-box;
        outline: none;
        border: none;
        z-index: 2;
        border-radius: 5px;
        text-indent: 1rem;

        &:focus {
          box-shadow: 0px 4px 6px rgba($color: $color-blue, $alpha: 0.5);
          & ~ .inputBorder {
            width: 100%;
            height: 100%;
          }
        }
      }

      .inputBorder {
        position: absolute;
        content: "";
        top: 0;
        left: 0;
        width: 0%;
        height: 0%;
        background: $color-blue;
        z-index: -1;
        transition: height 0.3s, width 0.3s 0.1s;
      }
    }

    .addButtons {
      width: 100%;
      display: flex;
      cursor: pointer;

      > p {
        flex: 0 0 50%;
        text-align: center;
        transition: 0.2s;

        &:hover {
          color: $color-blue;
        }
      }
    }
  }
}
</style>
