import { TaskListModel } from "./models/TaskListModel";

export enum list {
  DOING,
  SUSPENDED,
  FOR_REALISATION,
  SOLVED,
  DONE
}

export const initTasks: Array<TaskListModel> = [
  {
    id: list.DOING,
    text: "Realizowane",
    list: []
  },
  {
    id: list.SUSPENDED,
    text: "Wstrzymane",
    list: []
  },
  {
    id: list.FOR_REALISATION,
    text: "Do realizacji",
    list: []
  },
  {
    id: list.SOLVED,
    text: "Rozwiązane",
    list: []
  },
  {
    id: list.DONE,
    text: "Zakończone",
    list: []
  }
];
