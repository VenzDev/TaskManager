import { Module, VuexModule, getModule, Mutation, Action } from "vuex-module-decorators";
import store from "@/store";
import { TaskListModel, TaskModel } from "../models/TaskListModel";
import { initTasks } from "../initTasks";
import generateID from "@/utils/generateID";
import UserModel from "../models/UserModel";

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

interface EditTaskDescriptionParams {
  columnOrder: number;
  taskOrder: number;
  description: string;
}

interface MoveTaskParams {
  columnOrder: number;
  taskOrder: number;
  columnId: number;
}

interface AssignUserParams {
  columnOrder: number;
  taskOrder: number;
  user: UserModel;
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
  get taskByID() {
    return (id: number) => this.tasksColumns[id];
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
      favourite: false,
      description: null,
      user: null
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
  editTaskDescription({ columnOrder, taskOrder, description }: EditTaskDescriptionParams) {
    this.tasksColumns[columnOrder].list[taskOrder].description = description;
    return this.tasksColumns;
  }
  @Action({ commit: "updateTasks" })
  removeTask({ columnIndex, taskIndex }: RemoveTaskParams) {
    this.tasksColumns[columnIndex].list.splice(taskIndex, 1);
    return this.tasksColumns;
  }
  @Action({ commit: "updateTasks" })
  assignUserToTask({ columnOrder, taskOrder, user }: AssignUserParams) {
    this.tasksColumns[columnOrder].list[taskOrder].user = user;
    return this.tasksColumns;
  }

  @Action({ commit: "updateTasks" })
  moveTask({ columnOrder, taskOrder, columnId }: MoveTaskParams) {
    const task = this.tasksColumns[columnOrder].list[taskOrder];
    this.tasksColumns[columnOrder].list.splice(taskOrder, 1);

    this.tasksColumns.forEach((column, index) => {
      if (columnId === column.id) {
        this.tasksColumns[index].list.push(task);
      }
    });
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
