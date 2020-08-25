import { Module, VuexModule, getModule, Mutation, Action } from "vuex-module-decorators";
import store from "@/store";
import { TaskListModel, TaskModel } from "../models/TaskListModel";
import { initTasks } from "../initTasks";
import generateID from "@/utils/generateID";

interface EditTaskParams {
  columnIndex: number;
  taskId: string;
  text: string;
}

interface CreateTaskParams {
  columnIndex: number;
  text: string;
}

interface ToggleFavParams {
  columnIndex: number;
  taskIndex: number;
}

interface RemoveTaskParams {
  columnIndex: number;
  taskIndex: number;
}

@Module({
  name: "tasks",
  dynamic: true,
  store,
  namespaced: true
})
class Tasks extends VuexModule {
  tasksColumns: Array<TaskListModel> = initTasks;

  get allTasks() {
    return this.tasksColumns;
  }
  @Mutation
  updateTasks(newTasks: Array<TaskListModel>) {
    this.tasksColumns = newTasks;
    localStorage.removeItem("tasks");
    localStorage.setItem("tasks", JSON.stringify(this.tasksColumns));
  }

  @Action({ commit: "updateTasks" })
  changeTasks(newTasks: Array<TaskListModel>) {
    return newTasks;
  }

  @Action({ commit: "updateTasks" })
  createTask({ columnIndex, text }: CreateTaskParams) {
    const newDate = new Date().toLocaleString();
    const newTask: TaskModel = {
      id: generateID(),
      text,
      date: newDate,
      favourite: false
    };
    this.tasksColumns[columnIndex].list.push(newTask);
    return this.tasksColumns;
  }

  @Action({ commit: "updateTasks" })
  editTask({ columnIndex, taskId, text }: EditTaskParams) {
    const task = this.tasksColumns[columnIndex].list.filter(task => task.id === taskId)[0];
    if (task) {
      const taskIndex = this.tasksColumns[columnIndex].list.indexOf(task);
      if (taskIndex !== -1) this.tasksColumns[columnIndex].list[taskIndex].text = text;
    }
    return this.tasksColumns;
  }
  @Action({ commit: "updateTasks" })
  removeTask({ columnIndex, taskIndex }: RemoveTaskParams) {
    this.tasksColumns[columnIndex].list.splice(taskIndex, 1);
    return this.tasksColumns;
  }

  @Action({ commit: "updateTasks" })
  toggleFavourite({ columnIndex, taskIndex }: ToggleFavParams) {
    const value = this.tasksColumns[columnIndex].list[taskIndex].favourite;
    this.tasksColumns[columnIndex].list[taskIndex].favourite = !value;
    return this.tasksColumns;
  }

  @Action({ commit: "updateTasks" })
  getTasksFromLocalStorage() {
    const local = localStorage.getItem("tasks");
    if (local === null) return this.tasksColumns;
    return JSON.parse(local);
  }
}
export default getModule(Tasks);
