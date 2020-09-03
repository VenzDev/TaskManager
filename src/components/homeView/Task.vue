<template>
  <div class="task" :class="{ favourite: task.favourite, delete: deletingTask }">
    <router-link class="taskName" tag="p" v-if="editTaskId !== task.id" :to="`/task/${task.id}`">
      {{ task.text }}
    </router-link>
    <input v-else v-model="editTaskText" type="text" />
    <router-link class="taskUser" tag="p" v-if="task.user" :to="`/user/${task.user.id}`">
      {{ task.user.first_name + " " + task.user.last_name }}
    </router-link>
    <div class="taskOptions" v-if="task.date">
      <p>{{ task.date }}</p>
      <div class="optionsContainer">
        <p
          v-if="editTaskId !== task.id"
          @click="
            editTaskId = task.id;
            editTaskText = task.text;
          "
        >
          <i class="fas fa-edit"></i>
        </p>
        <p @click="handleEditTask" v-else><i class="fas fa-check"></i></p>
        <p @click="toggleFavourite">
          <i :class="{ favourite: task.favourite }" class="far fa-star"></i>
        </p>
        <p @click="removeTask"><i class="far fa-trash-alt"></i></p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { TaskModel } from "@/store/models/TaskListModel";
import tasks from "@/store/modules/tasks";

@Component
export default class Task extends Vue {
  @Prop() task!: TaskModel;
  @Prop() columnOrder!: number;
  @Prop() taskOrder!: number;

  editTaskId: string | null = null;
  editTaskText: string | null = null;
  deletingTask = false;

  removeTask() {
    this.deletingTask = true;
    setTimeout(() => {
      tasks.removeTask({ columnOrder: this.columnOrder, taskOrder: this.taskOrder });
    }, 300);
  }

  closeEditTaskInput() {
    this.editTaskText = null;
    this.editTaskId = null;
  }

  handleEditTask() {
    if (this.editTaskId && this.editTaskText)
      tasks.editTask({ columnOrder: this.columnOrder, taskId: this.editTaskId, text: this.editTaskText });
    this.closeEditTaskInput();
  }

  toggleFavourite() {
    tasks.toggleFavourite({ columnOrder: this.columnOrder, taskOrder: this.taskOrder });
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/config.scss";

.task {
  padding: 1rem;
  margin: 1rem;
  border-radius: 6px;
  border: 1px solid $color-light;
  position: relative;
  overflow: hidden;
  cursor: grab;
  transition: opacity 0.3s;

  &::after {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    height: 0;
    width: 6px;
    background-color: $color-blue;
    transition: height 0.2s;
  }

  &.favourite::after {
    height: 100%;
  }

  &.delete {
    opacity: 0;
  }

  .taskName {
    padding: 0.3rem;
    padding-left: 0;
  }

  .taskName:hover,
  .taskUser:hover {
    color: $color-blue;
  }
  .taskUser {
    font-size: 0.8rem;
    font-weight: bold;
  }

  input {
    width: 100%;
    font-size: 1rem;
    border: none;
    margin: 0.3rem 0;
    padding: 0.3rem;
    border-radius: 6px;
    box-shadow: 0px 0px 0px 1px $color-light;
    padding-left: 0;
    text-indent: 0.3rem;
    outline: none;
  }

  > p {
    cursor: pointer;
    word-wrap: break-word;
    margin: 0.3rem 0;
  }

  .taskOptions {
    font-size: 0.8rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .optionsContainer {
      margin-top: 0.5rem;
      display: flex;
      justify-content: space-around;

      > p {
        @include blueButton;
        flex: 0 0 20%;
        height: 30px;
        line-height: 30px;
        text-align: center;
      }
    }
  }
}
</style>
