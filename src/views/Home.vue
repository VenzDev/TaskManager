<template>
  <Draggable
    v-model="tasksColumns"
    v-bind="dragOptions"
    @start="start"
    @end="end"
    tag="div"
    handle=".columnName"
    class="columnsContainer"
  >
    <Column :columnName="column.text" v-for="(column, columnOrder) in tasksColumns" :key="column.id">
      <div class="tasksContainer">
        <Draggable @start="start" @end="end" :list="column.list" v-bind="dragOptions" group="tasks">
          <Task
            v-for="(task, taskOrder) in column.list"
            :key="task.id"
            :task="task"
            :taskOrder="taskOrder"
            :columnOrder="columnOrder"
          />
        </Draggable>
      </div>
      <AddTask :columnOrder="columnOrder" />
    </Column>
  </Draggable>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Draggable from "vuedraggable";
import DraggableEvent from "@/store/models/DraggableEvent";
import tasks from "@/store/modules/tasks";
import { Column, AddTask, Task } from "@/components/homeView";

@Component({ components: { Draggable, Task, AddTask, Column } })
export default class Home extends Vue {
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
}
</script>

<style lang="scss" scoped>
@import "@/styles/config.scss";

.columnsContainer {
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  padding-top: 1rem;

  @media (max-width: 1000px) {
    justify-content: flex-start;
    overflow: auto;
    @include customScrollbar;
  }

  .tasksContainer {
    background-color: lightgray;
    min-height: 50px;
    max-height: 69vh;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 1rem 0;
    box-shadow: 0px 6px 12px 4px rgba(0, 0, 0, 0.25) inset;
    @include customScrollbar;

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
}
.hide {
  opacity: 0;
}
</style>
