<template>
  <div class="task" :class="{ favourite: task.favourite }">
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
        <p>
          <i
            @click="
              editTaskId = task.id;
              editTaskText = task.text;
            "
            v-if="editTaskId !== task.id"
            class="fas fa-edit"
          ></i>
          <i @click="handleEditTask" v-else style="color:green;" class="fas fa-check"></i>
        </p>
        <p>
          <i @click="toggleFavourite" :class="{ favourite: task.favourite }" class="far fa-star"></i>
        </p>
        <p><i @click="removeTask" class="far fa-trash-alt"></i></p>
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

  removeTask() {
    tasks.removeTask({ columnOrder: this.columnOrder, taskOrder: this.taskOrder });
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
  background-color: $color-light;
  padding: 1rem;
  margin: 1rem;
  border-radius: 6px;
  cursor: grab;

  & .taskName {
    font-weight: bold;
  }

  & .taskName:hover,
  & .taskUser:hover {
    color: blue;
  }

  & input {
    width: 100%;
    font-size: 1rem;
    border: none;
    margin: 0.3rem 0;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25) inset;
  }

  &.favourite {
    border-left: 4px solid blue;
  }

  & > p {
    cursor: pointer;
    word-wrap: break-word;
    margin: 0.3rem 0;
  }

  & .taskOptions {
    font-size: 0.8rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    & .optionsContainer {
      margin-top: 0.5rem;
      display: flex;

      & .favourite {
        color: blue;
      }

      & p {
        flex-basis: 33.33%;
        text-align: center;
        font-size: 1rem;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
