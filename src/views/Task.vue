<template>
  <div>
    <MoveTaskModal
      :isModalOpen="isMoveTaskModalOpen"
      :toggleModal="toggleMoveTaskModal"
      :currentColumnName="columnName"
      :columnOrder="columnOrder"
      :taskOrder="taskOrder"
      :updateTask="updateTask"
      :task="task"
    />
    <AssignUserModal
      :columnOrder="columnOrder"
      :taskOrder="taskOrder"
      :updateTask="updateTask"
      :isModalOpen="isAssignUserModalOpen"
      :toggleModal="toggleAssignUserModal"
    />
    <div class="task">
      <div class="taskDesc">
        <button @click="handleRedirect"><i class="fas fa-arrow-left"></i> Wróć do listy zadań</button>
        <h2>{{ `Lista: ${columnName}` }}</h2>
        <p>{{ `Zadanie: ${task.text}` }}</p>
        <div class="textareaWrapper" @click="handleActiveTextarea">
          <textarea
            ref="textarea"
            :placeholder="task.description ? task.description : 'Wpisz badziej szczegółowy opis'"
            :class="{ active: activeTextarea }"
            v-model="taskDescription"
            :disabled="!activeTextarea"
          ></textarea>
        </div>
        <div class="textareaButtons" v-if="activeTextarea">
          <button @click="editTaskDescription"><i class="fas fa-edit"></i> Edytuj</button>
          <button @click="disableTextarea"><i class="fas fa-times"></i></button>
        </div>
        <p v-if="!task.user">Nie przydzielono użytkownika do zadania</p>
        <div v-else class="userDesc">
          <div>
            <router-link class="userName" tag="p" :to="`/user/${task.user.id}`">{{
              task.user.first_name + " " + task.user.last_name
            }}</router-link>
            <p>{{ task.user.email }}</p>
            <p>{{ task.user.job_title }}</p>
            <p>{{ task.user.city }}</p>
            <p>{{ task.user.street }}</p>
          </div>
          <div>
            <img :src="task.user.avatar" alt="avatar" />
          </div>
        </div>
      </div>
      <div class="taskOptions">
        <h2>Działania</h2>
        <button @click="toggleAssignUserModal"><i class="far fa-user"></i> Przydziel zadanie</button>
        <button @click="toggleMoveTaskModal"><i class="fas fa-exchange-alt"></i> Przenieś zadanie</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import tasks from "@/store/modules/tasks";
import { TaskModel } from "@/store/models/TaskListModel";
import { AssignUserModal, MoveTaskModal } from "@/components/taskView";

@Component({ components: { MoveTaskModal, AssignUserModal } })
export default class Task extends Vue {
  columnName: string | null = null;
  task: TaskModel | null = null;
  activeTextarea = false;
  taskDescription: string | null = null;

  columnOrder: number | null = null;
  taskOrder: number | null = null;

  isMoveTaskModalOpen = false;
  isAssignUserModalOpen = false;

  handleActiveTextarea() {
    this.activeTextarea = true;
    this.$nextTick(() => (this.$refs.textarea as HTMLInputElement).focus());
  }

  toggleMoveTaskModal() {
    this.isMoveTaskModalOpen = !this.isMoveTaskModalOpen;
  }
  toggleAssignUserModal() {
    this.isAssignUserModalOpen = !this.isAssignUserModalOpen;
  }

  updateTask() {
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

  created() {
    this.updateTask();
  }
  editTaskDescription() {
    if (this.columnOrder !== null && this.taskOrder !== null && this.taskDescription) {
      tasks.editTaskDescription({
        columnOrder: this.columnOrder,
        taskOrder: this.taskOrder,
        description: this.taskDescription
      });
    }
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

  @media (max-width: 1100px) {
    width: 90%;
  }
  @media (max-width: 850px) {
    width: 100%;
  }
  @media (max-width: 750px) {
    flex-direction: column;
    height: auto;
  }

  & .taskDesc {
    margin: 0 10%;
    flex-basis: 70%;

    & > button {
      @include primaryButtonWithHover;
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
        @include primaryButton;
        margin: 0.5rem;
        width: auto;
        text-align: center;

        &:last-child {
          background-color: red;
        }
      }
    }
    & .userDesc {
      display: flex;
      justify-content: space-between;
      align-items: center;

      @media (max-width: 600px) {
        flex-direction: column;
      }

      & div {
        flex: 0 0 50%;
      }

      & .userName {
        color: blue;
        font-weight: bold;
        cursor: pointer;
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

    @media (max-width: 750px) {
      order: -1;
      flex-basis: 20%;
    }

    & h2 {
      margin: 1rem;
      text-align: center;
    }

    & button {
      @include primaryButtonWithHover;
      width: 180px;
      margin: 1rem auto;
      background-color: red;
    }
  }
}
</style>
