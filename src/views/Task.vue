<template>
  <div>
    <div class="task">
      <div class="taskDesc">
        <button @click="handleRedirect"><i class="fas fa-arrow-left"></i> Wróć do listy zadań</button>
        <h2>{{ `Lista: ${columnName}` }}</h2>
        <p>{{ `Zadanie: ${task.text}` }}</p>
        <div class="textareaWrapper" @click="handleActiveTextarea">
          <textarea
            ref="textarea"
            :class="{ active: activeTextarea }"
            v-model="task.description"
            :disabled="!activeTextarea"
          ></textarea>
        </div>
        <div class="textareaButtons" v-if="activeTextarea">
          <button @click="editTaskDescription"><i class="fas fa-edit"></i> Edytuj</button>
          <button @click="disableTextarea"><i class="fas fa-times"></i></button>
        </div>
        <p>Nie przydzielono użytkownika do zadania</p>
      </div>
      <div class="taskOptions">
        <h2>Działania</h2>
        <button><i class="far fa-user"></i> Przydziel zadanie</button>
        <button><i class="fas fa-exchange-alt"></i> Przenieś zadanie</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import tasks from "@/store/modules/tasks";
import { TaskModel } from "@/store/models/TaskListModel";
@Component
export default class Task extends Vue {
  columnName: string | null = null;
  task: TaskModel | null = null;
  activeTextarea = false;
  taskDescription: string | null = null;

  columnOrder: number | null = null;
  taskOrder: number | null = null;

  handleActiveTextarea() {
    this.activeTextarea = true;
    this.$nextTick(() => (this.$refs.textarea as HTMLInputElement).focus());
  }

  created() {
    const taskId = this.$route.params.id;
    const tasksColumns = tasks.allTasks;
    tasksColumns.forEach((column, colOrder) => {
      column.list.forEach((task, taskOrder) => {
        if (task.id === taskId) {
          this.columnName = column.text;
          this.columnOrder = colOrder;
          this.taskOrder = taskOrder;
          this.task = task;
        }
      });
    });
    if (this.task) this.taskDescription = this.task.description;
    if (this.columnName === null) this.$router.push("/");
  }
  editTaskDescription() {
    if (this.columnOrder && this.taskOrder && this.taskDescription)
      tasks.editTaskDescription({
        columnOrder: this.columnOrder,
        taskOrder: this.taskOrder,
        description: this.taskDescription
      });
    this.disableTextarea();
  }
  disableTextarea() {
    this.activeTextarea = false;
  }
  handleRedirect() {
    this.$router.push("/");
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/config.scss";
.task {
  display: flex;
  position: absolute;
  width: 70%;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 6px;
  box-shadow: 0px 6px 12px rgba($color: #000000, $alpha: 0.25);
  height: 80vh;
  background-color: $color-light;

  @media (max-width: 1000px) {
    width: 90%;
  }
  @media (max-width: 750px) {
    width: 100%;
  }
  @media (max-width: 600px) {
    flex-direction: column;
  }

  & .taskDesc {
    margin: 0 10%;
    flex-basis: 70%;

    & > button {
      display: block;
      margin: 1rem;
      width: 200px;
      text-align: left;
      padding: 0.5rem;
      margin-bottom: 0.5rem;
      border-radius: 6px;
      cursor: pointer;
      border: none;
      color: white;
      background-color: green;
      font-size: 1rem;
      transition: 0.2s;

      &:hover {
        font-size: 1.05rem;
      }

      & i {
        width: 20px;
      }
    }
    & .textareaWrapper {
      margin: 0 1rem;
    }
    textarea {
      display: block;
      height: 120px;
      width: 100%;
      box-sizing: border-box;
      font-size: 1rem;
      padding-top: 0.5rem;
      padding-left: 0.5rem;

      &:disabled {
        color: black;
      }

      cursor: pointer;
      resize: none;
      &.active {
        cursor: initial;
      }
    }
    .textareaButtons {
      display: flex;
      justify-content: flex-end;
      margin-right: 1rem;

      & button {
        padding: 0.5rem;
        cursor: pointer;
        border: none;
        color: white;
        background-color: green;
        margin-top: 1rem;
        margin-left: 1rem;
        border-radius: 6px;
        padding: 0.5rem 1rem;

        &:last-child {
          background-color: red;
        }
      }
    }

    h2,
    p {
      margin: 1rem;
    }
  }

  & .taskOptions {
    border-left: 1px solid lightgray;
    flex-basis: 30%;

    @media (max-width: 600px) {
      order: -1;
      flex-basis: 20%;
    }

    & h2 {
      margin: 1rem;
      text-align: center;
    }

    & button {
      display: block;
      margin: 0 auto;
      width: 180px;
      text-align: left;
      padding: 0.5rem;
      margin-bottom: 0.5rem;
      border-radius: 6px;
      cursor: pointer;
      border: none;
      color: white;
      background-color: red;
      font-size: 1rem;
      transition: 0.2s;

      &:hover {
        font-size: 1.05rem;
      }

      & i {
        width: 20px;
      }
    }
  }
}
</style>
