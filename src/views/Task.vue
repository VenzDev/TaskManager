<template>
  <div>
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
        <h2>Lista: {{ columnName }}</h2>
        <p>Zadanie: {{ task.text }}</p>
        <div class="textareaWrapper">
          <div @click="handleActiveTextarea">
            <textarea
              ref="textarea"
              :placeholder="task.description ? task.description : 'Wpisz badziej szczegółowy opis'"
              :class="{ active: activeTextarea }"
              v-model="taskDescription"
              :disabled="!activeTextarea"
            ></textarea>
          </div>
          <transition name="fade">
            <div class="textareaButtons" v-if="activeTextarea">
              <button @click="editTaskDescription"><i class="fas fa-edit"></i> Edytuj</button>
              <button @click="disableTextarea"><i class="fas fa-times"></i></button>
            </div>
          </transition>
        </div>

        <p class="noUserText" v-if="!task.user">Nie przydzielono użytkownika do zadania</p>
        <div v-else class="userDesc">
          <div>
            <router-link class="userName" tag="p" :to="`/user/${task.user.id}`">{{
              `${task.user.first_name} ${task.user.last_name}`
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
        <div>
          <button @click="toggleMoveOptions">
            Przenieś zadanie
            <p :class="{ active: isMoveOptionsOpen }"><i class="fas fa-angle-down"></i></p>
          </button>
        </div>
        <transition name="moveOptions">
          <div v-if="isMoveOptionsOpen" class="moveOptions">
            <span @click="moveTask(option)" v-for="option in availableColumns" :key="option.id">{{ option.text }}</span>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import tasks from "@/store/modules/tasks";
import { TaskModel } from "@/store/models/TaskListModel";
import { AssignUserModal } from "@/components/taskView";

interface Column {
  id: number;
  text: string;
}

@Component({ components: { AssignUserModal } })
export default class Task extends Vue {
  columnName: string | null = null;
  task: TaskModel | null = null;
  activeTextarea = false;
  taskDescription: string | null = null;

  columnOrder: number | null = null;
  taskOrder: number | null = null;

  availableColumns: Array<Column> = [];

  isMoveOptionsOpen = false;
  isAssignUserModalOpen = false;

  handleActiveTextarea() {
    this.activeTextarea = true;
    this.$nextTick(() => (this.$refs.textarea as HTMLInputElement).focus());
  }

  toggleMoveOptions() {
    this.isMoveOptionsOpen = !this.isMoveOptionsOpen;
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

  moveTask(column: Column) {
    if (column !== null && this.columnOrder !== null && this.taskOrder !== null) {
      tasks.moveTask({ columnOrder: this.columnOrder, taskOrder: this.taskOrder, columnId: column.id });
      this.updateTask();
    }
    this.toggleMoveOptions();
  }

  created() {
    this.updateTask();

    tasks.allTasks.forEach(column => {
      if (column.text !== this.columnName) this.availableColumns.push({ id: column.id, text: column.text });
    });
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
  box-shadow: 0px 12px 24px rgba($color: $color-black, $alpha: 0.15);
  min-height: 80vh;
  background-color: $color-white;

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

  .taskDesc {
    margin: 0 10%;
    flex-basis: 70%;

    .noUserText {
      margin-top: 3rem;
    }

    > button {
      @include blueButton;
      padding: 0.5rem 0.8rem;
      margin-top: 1rem;
      margin-left: 1rem;
      outline: none;
      border: none;
    }

    .textareaWrapper {
      margin: 0 1rem;
      position: relative;

      textarea {
        display: block;
        height: 120px;
        width: 100%;
        box-sizing: border-box;
        font-size: 1rem;
        padding-top: 0.5rem;
        padding-left: 0.5rem;
        outline: none;
        cursor: pointer;
        resize: none;

        &:disabled {
          color: $color-black;
        }

        &.active {
          cursor: initial;
        }
      }

      .textareaButtons {
        position: absolute;
        right: 0;
        display: flex;
        justify-content: flex-end;
        margin-left: 1rem;

        button {
          @include blueButton;
          padding: 0.4rem 0.8rem;
          border: none;
          outline: none;
          margin: 0.5rem;
          width: auto;
          text-align: center;
        }
      }
    }

    .userDesc {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 1rem;
      margin-top: 3rem;
      border: 1px solid $color-light;
      border-radius: 6px;

      @media (max-width: 600px) {
        flex-direction: column;
      }

      div {
        flex: 0 0 50%;

        img {
          width: 90%;
        }
      }

      .userName {
        color: $color-blue;
        font-weight: bold;
        cursor: pointer;
      }
    }

    h2,
    p {
      margin: 1rem;
    }
  }

  .taskOptions {
    border-left: 1px solid $color-light;
    flex-basis: 30%;

    @media (max-width: 750px) {
      order: -1;
      flex-basis: 20%;
      border-bottom: 1px solid $color-light;
    }

    > div {
      position: relative;
    }

    h2 {
      margin: 1rem;
      text-align: center;
    }

    button {
      @include blueButton;
      display: block;
      padding: 0.5rem 0.8rem;
      outline: none;
      border: none;
      margin: 1rem auto;
    }

    button:last-child {
      margin-bottom: 0.5rem;

      p {
        display: inline-block;
        background-color: $color-lightBlue;
        width: 20px;
        border-radius: 6px;
        transition: 0.3s;
        transform: rotate(0);
      }

      p.active {
        display: inline-block;
        transform: rotate(180deg);
      }
    }

    .moveOptions {
      background-color: $color-body;
      width: 60%;
      padding: 0.5rem;
      margin: 0 auto;
      border-radius: 10px;
      box-shadow: $shadow-dark;

      span {
        display: block;
        cursor: pointer;
        transition: 0.3s;
        margin: 0.2rem 0;

        &:hover {
          color: $color-blue;
        }
      }
    }
  }
}

//transitions
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.moveOptions-enter-active,
.moveOptions-leave-active {
  transition: 0.35s;
}
.moveOptions-enter,
.moveOptions-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
