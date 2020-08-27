<template>
  <div class="addTask">
    <p class="addIcon" v-if="selectedColumnOrder !== columnOrder" @click="selectedColumnOrder = columnOrder">
      <i class="fas fa-plus"></i>
    </p>
    <div class="input" v-else>
      <p>Nowe zadanie</p>
      <input v-model="newTask" type="text" />
      <div>
        <p @click="createNewTask"><i class="fas fa-check"></i></p>
        <p @click="closeCreateTaskInput"><i class="fas fa-times"></i></p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import tasks from "@/store/modules/tasks";

@Component
export default class AddTask extends Vue {
  @Prop() columnOrder!: number;
  selectedColumnOrder: number | null = null;
  newTask: string | null = null;

  createNewTask() {
    if (this.newTask && this.newTask.trim()) {
      tasks.createTask({ columnOrder: this.columnOrder, text: this.newTask });
      this.closeCreateTaskInput();
    }
  }

  closeCreateTaskInput() {
    this.selectedColumnOrder = null;
    this.newTask = null;
  }
}
</script>
<style lang="scss" scoped>
.addTask {
  padding: 0.5rem;
  text-align: center;

  & .addIcon {
    font-size: 1.5rem;
    transition: 0.2s;

    &:hover {
      color: blue;
    }
  }

  & > p {
    cursor: pointer;
  }

  & .input {
    & input {
      margin: 0.6rem 0;
      padding: 0.4rem;
      border: 1px solid black;
    }
    & > div {
      display: flex;
      margin: 0 1rem;
      & p {
        flex-basis: 50%;
        color: green;
        cursor: pointer;
        transition: 0.2s;
        &:hover {
          transform: scale(1.2);
        }
        &:last-child {
          color: red;
        }
      }
    }
  }
}
</style>
