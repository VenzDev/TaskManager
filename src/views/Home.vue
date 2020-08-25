<template>
  <Draggable
    v-model="tasksColumns"
    v-bind="dragOptions"
    @start="start"
    @end="end"
    tag="div"
    handle=".listName"
    class="listsContainer"
  >
    <div class="list" v-for="column in tasksColumns" :key="column.id">
      <h2 class="listName">{{ column.text }}</h2>
      <div class="tasksContainer">
        <Draggable @start="start" @end="end" :list="column.list" v-bind="dragOptions" group="tasks">
          <div class="task" v-for="task in column.list" :key="task.id">
            <router-link v-if="editTask !== task.id" to="/test">
              {{ task.text }}
            </router-link>
            <input v-else v-model="editTaskText" type="text" />
            <div class="taskOptions" v-if="task.date">
              <p>{{ task.date }}</p>
              <div class="optionsContainer">
                <p>
                  <i
                    @click="
                      editTask = task.id;
                      editTaskText = task.text;
                    "
                    v-if="editTask !== task.id"
                    class="fas fa-edit"
                  ></i>
                  <i @click="handleEditTask(column.id)" v-else style="color:green;" class="fas fa-check"></i>
                </p>
                <p><i class="far fa-star"></i></p>
                <p><i class="far fa-trash-alt"></i></p>
              </div>
            </div>
          </div>
        </Draggable>
      </div>
      <div class="addTask">
        <p class="addIcon" v-if="createNewId !== column.id" @click="createNewId = column.id">
          <i class="fas fa-plus"></i>
        </p>
        <div class="input" v-else>
          <p>Nowe zadanie</p>
          <input v-model="newTask" type="text" />
          <div>
            <p @click="createNewTask(column.id)"><i class="fas fa-check"></i></p>
            <p @click="closeCreateTaskInput"><i class="fas fa-times"></i></p>
          </div>
        </div>
      </div>
    </div>
  </Draggable>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import Draggable from "vuedraggable";
import { TaskListModel, TaskModel } from "@/store/models/TaskListModel";
import DraggableEvent from "@/store/models/DraggableEvent";
import tasks from "@/store/modules/tasks";

@Component({ components: { Draggable } })
export default class Home extends Vue {
  createNewId: number | null = null;
  newTask: string | null = null;
  editTask: number | null = null;
  editTaskText: string | null = null;
  idCounter = 30;
  get dragOptions() {
    return {
      animation: 300,
      dragClass: "dragClass"
    };
  }

  get tasksColumns() {
    return tasks.allTasks;
  }

  created() {
    tasks.getTasksFromLocalStorage();
  }

  start(e: DraggableEvent) {
    e.item.classList.add("hide");
  }
  end(e: DraggableEvent) {
    e.item.classList.remove("hide");
    if (this.tasksColumns) tasks.changeTasks(this.tasksColumns);
  }
  createNewTask(columnId: number) {
    const filteredList = this.tasksColumns?.filter(column => column.id === columnId)[0];
    if (filteredList && this.newTask) {
      const newDate = new Date().toLocaleString();
      console.log(newDate);
      const newTask: TaskModel = {
        id: this.idCounter,
        text: this.newTask,
        date: newDate
      };
      this.idCounter++;
      filteredList.list.push(newTask);
      this.createNewId = null;
      this.newTask = null;
    }
  }
  handleEditTask(listId: number) {
    if (this.tasksColumns) {
      const task = this.tasksColumns[listId].list.filter(task => task.id === this.editTask)[0];
      const index = this.tasksColumns[listId].list.indexOf(task);
      if (this.editTaskText) {
        this.tasksColumns[listId].list[index].text = this.editTaskText;
      }
      this.editTaskText = null;
      this.editTask = null;
    }
  }
  closeCreateTaskInput() {
    this.createNewId = null;
    this.newTask = null;
  }
  @Watch("array", { deep: true })
  watchArray() {
    if (this.tasksColumns) tasks.changeTasks(this.tasksColumns);
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/config.scss";

.listsContainer {
  display: flex;
  align-items: flex-start;

  & .list {
    margin: 1rem;
    width: 250px;
    border-radius: 6px;
    background-color: $color-light;

    & .listName {
      cursor: grab;
      padding: 1rem;
    }

    & .tasksContainer {
      min-height: 50px;
      background-color: lightgray;
      padding: 1rem 0;
      box-shadow: 0px 6px 12px 4px rgba(0, 0, 0, 0.25) inset;

      & .task {
        background-color: $color-light;
        padding: 1rem;
        margin: 1rem;
        border-radius: 6px;
        cursor: grab;

        & .taskOptions {
          font-size: 0.8rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          & .optionsContainer {
            margin-top: 0.5rem;
            display: flex;

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
    }

    & .addTask {
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
  }
}
.hide {
  opacity: 0;
}
</style>
