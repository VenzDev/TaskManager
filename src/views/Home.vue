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
    <div class="list" v-for="(column, colIndex) in tasksColumns" :key="column.id">
      <h2 class="listName">{{ column.text }}</h2>
      <div class="tasksContainer">
        <Draggable @start="start" @end="end" :list="column.list" v-bind="dragOptions" group="tasks">
          <div
            class="task"
            :class="{ favourite: task.favourite }"
            v-for="(task, taskIndex) in column.list"
            :key="task.id"
          >
            <router-link tag="p" v-if="editTask !== task.id" :to="`/task/${task.id}`">
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
                  <i @click="handleEditTask(colIndex)" v-else style="color:green;" class="fas fa-check"></i>
                </p>
                <p>
                  <i
                    @click="toggleFavourite(colIndex, taskIndex)"
                    :class="{ favourite: task.favourite }"
                    class="far fa-star"
                  ></i>
                </p>
                <p><i @click="removeTask(colIndex, taskIndex)" class="far fa-trash-alt"></i></p>
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
            <p @click="createNewTask(colIndex)"><i class="fas fa-check"></i></p>
            <p @click="closeCreateTaskInput"><i class="fas fa-times"></i></p>
          </div>
        </div>
      </div>
    </div>
  </Draggable>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Draggable from "vuedraggable";
import DraggableEvent from "@/store/models/DraggableEvent";
import tasks from "@/store/modules/tasks";

@Component({ components: { Draggable } })
export default class Home extends Vue {
  createNewId: number | null = null;
  newTask: string | null = null;
  editTask: string | null = null;
  editTaskText: string | null = null;
  get dragOptions() {
    return {
      animation: 300,
      dragClass: "dragClass"
    };
  }

  get tasksColumns() {
    return tasks.allTasks;
  }
  set tasksColumns(_tasks) {
    if (_tasks) tasks.updateTasks(_tasks);
  }

  start(e: DraggableEvent) {
    e.item.classList.add("hide");
  }
  end(e: DraggableEvent) {
    e.item.classList.remove("hide");
    if (this.tasksColumns) tasks.changeTasks(this.tasksColumns);
  }
  createNewTask(columnIndex: number) {
    if (this.newTask && this.newTask.trim()) {
      tasks.createTask({ columnIndex, text: this.newTask });
      this.closeCreateTaskInput();
    }
  }
  removeTask(columnIndex: number, taskIndex: number) {
    tasks.removeTask({ columnIndex, taskIndex });
  }
  handleEditTask(columnIndex: number) {
    if (this.editTask && this.editTaskText)
      tasks.editTask({ columnIndex, taskId: this.editTask, text: this.editTaskText });
    this.closeEditTaskInput();
  }
  toggleFavourite(columnIndex: number, taskIndex: number) {
    tasks.toggleFavourite({ columnIndex, taskIndex });
  }
  closeCreateTaskInput() {
    this.createNewId = null;
    this.newTask = null;
  }
  closeEditTaskInput() {
    this.editTaskText = null;
    this.editTask = null;
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/config.scss";

.listsContainer {
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  overflow: auto;
  padding-top: 1rem;

  & .list {
    flex: 0 0 18%;
    border-radius: 6px;
    background-color: $color-light;
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);

    & .listName {
      cursor: grab;
      padding: 1rem;
    }

    & .tasksContainer {
      background-color: lightgray;
      min-height: 50px;
      max-height: 69vh;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 1rem 0;
      box-shadow: 0px 6px 12px 4px rgba(0, 0, 0, 0.25) inset;
      & > div {
        min-height: 50px;
      }
      & .task {
        background-color: $color-light;
        padding: 1rem;
        margin: 1rem;
        border-radius: 6px;
        cursor: grab;

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
