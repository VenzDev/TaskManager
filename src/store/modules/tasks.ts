import { Module, VuexModule, getModule, Mutation, Action } from "vuex-module-decorators";
import store from "@/store";
import { TaskListModel } from "../models/TaskListModel";
import { initTasks } from "../initTasks";

@Module({
  name: "tasks",
  dynamic: true,
  store,
  namespaced: true
})
class Tasks extends VuexModule {
  tasks: Array<TaskListModel> | null = initTasks;

  get allTasks() {
    return this.tasks;
  }
  @Mutation
  updateTasks(newTasks: Array<TaskListModel>) {
    this.tasks = newTasks;
    localStorage.removeItem("tasks");
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  @Action({ commit: "updateTasks" })
  changeTasks(newTasks: Array<TaskListModel>) {
    return newTasks;
  }

  @Action({ commit: "updateTasks" })
  getTasksFromLocalStorage() {
    const local = localStorage.getItem("tasks");
    console.log(local);
    if (local === null) return this.tasks;
    return JSON.parse(local);
  }
}
export default getModule(Tasks);
