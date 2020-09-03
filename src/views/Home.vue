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
      <Draggable
        @start="start"
        @end="end"
        :move="checkMove"
        :list="column.list"
        v-bind="dragOptions"
        group="tasks"
        :id="column.id"
      >
        <transition-group name="list" class="tasksContainer" tag="div">
          <Task
            :id="task.user ? task.user.job_title : null"
            v-for="(task, taskOrder) in column.list"
            :key="task.id"
            :task="task"
            :taskOrder="taskOrder"
            :columnOrder="columnOrder"
          />
        </transition-group>
      </Draggable>

      <AddTask
        :selectedColumnId="selectedColumnId"
        :selectColumnId="selectColumnId"
        :columnId="column.id"
        :columnOrder="columnOrder"
      />
    </Column>
  </Draggable>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Draggable from "vuedraggable";
import DraggableEvent from "@/store/models/DraggableEvent";
import tasks from "@/store/modules/tasks";
import searchbox from "@/store/modules/searchbox";
import { Column, AddTask, Task } from "@/components/homeView";
import { TaskListModel } from "@/store/models/TaskListModel";
import { list, PROJECT_MANAGER } from "@/store/initTasks";
import UserModel from "@/store/models/UserModel";
import SmoothHeight from "@/components/smoothHeight.vue";

@Component({ components: { Draggable, Task, AddTask, Column, SmoothHeight } })
export default class Home extends Vue {
  selectedUser: UserModel | null = null;
  selectedColumnId: number | null = null;
  copy: Array<TaskListModel> | null = null;

  selectColumnId(selectedColumnId: number | null) {
    this.selectedColumnId = selectedColumnId;
  }

  get dragOptions() {
    return {
      animation: 300,
      dragClass: "dragClass"
    };
  }

  get allTasks() {
    this.copy = tasks.allTasks;
    return tasks.allTasks;
  }

  //Returns all tasks when there is no selected user
  //Otherwise returns tasks only assigned to selected user
  get tasksColumns() {
    this.selectedUser = searchbox.searchbarUser;
    if (!searchbox.searchbarUser) return this.allTasks;

    const copiedColumns: Array<TaskListModel> = [];
    const columns = this.allTasks;

    //prevent from modify original tasks
    columns.forEach(column => copiedColumns.push({ ...column, list: [...column.list] }));

    copiedColumns.forEach(column => {
      column.list = column.list.filter(task => {
        if (task.user && this.selectedUser && task.user.id === this.selectedUser.id) return task;
      });
    });
    return copiedColumns;
  }

  set tasksColumns(_tasks) {
    if (_tasks) tasks.updateTasks(_tasks);
  }

  start(e: DraggableEvent) {
    e.item.classList.add("hide");
  }

  end(e: DraggableEvent) {
    e.item.classList.remove("hide");
    tasks.changeTasks(this.allTasks);
  }

  checkMove(e: DraggableEvent) {
    if (parseInt(e.to.parentElement.id) === list.DONE && e.dragged.id !== PROJECT_MANAGER) return false;
    return true;
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
    min-height: 50px;
    max-height: 69vh;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 1rem 0;
    @include customScrollbar;
  }
}

.hide {
  opacity: 0;
}

//Task transition
.list-enter-active {
  transition: opacity 0.5s;
}
.list-enter {
  opacity: 0;
}
.list-leave-active {
  display: none !important;
}
</style>
