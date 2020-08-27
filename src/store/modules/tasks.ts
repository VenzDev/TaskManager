import { Module, VuexModule, getModule, Mutation, Action } from "vuex-module-decorators";
import store from "@/store";
import { TaskListModel, TaskModel } from "../models/TaskListModel";
import { initTasks } from "../initTasks";
import generateID from "@/utils/generateID";
import UserModel from "../models/UserModel";

interface EditTaskParams {
  columnOrder: number;
  taskId: string;
  text: string;
}

interface CreateTaskParams {
  columnOrder: number;
  text: string;
}

interface TaskPosition {
  columnOrder: number;
  taskOrder: number;
}

interface EditTaskDescriptionParams extends TaskPosition {
  description: string;
}

interface MoveTaskParams extends TaskPosition {
  columnId: number;
}

interface AssignUserParams extends TaskPosition {
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
  createTask({ columnOrder, text }: CreateTaskParams) {
    const newDate = new Date().toLocaleString();
    const newTask: TaskModel = {
      id: generateID(),
      text,
      date: newDate,
      favourite: false,
      description: null,
      user: null
    };
    this.tasksColumns[columnOrder].list.push(newTask);
    return this.tasksColumns;
  }

  @Action({ commit: "updateTasks" })
  editTask({ columnOrder, taskId, text }: EditTaskParams) {
    const task = this.tasksColumns[columnOrder].list.filter(task => task.id === taskId)[0];
    if (task) {
      const taskIndex = this.tasksColumns[columnOrder].list.indexOf(task);
      if (taskIndex !== -1) this.tasksColumns[columnOrder].list[taskIndex].text = text;
    }
    return this.tasksColumns;
  }
  @Action({ commit: "updateTasks" })
  editTaskDescription({ columnOrder, taskOrder, description }: EditTaskDescriptionParams) {
    this.tasksColumns[columnOrder].list[taskOrder].description = description;
    return this.tasksColumns;
  }
  @Action({ commit: "updateTasks" })
  removeTask({ columnOrder, taskOrder }: TaskPosition) {
    this.tasksColumns[columnOrder].list.splice(taskOrder, 1);
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
  toggleFavourite({ columnOrder, taskOrder }: TaskPosition) {
    const value = this.tasksColumns[columnOrder].list[taskOrder].favourite;
    this.tasksColumns[columnOrder].list[taskOrder].favourite = !value;
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
