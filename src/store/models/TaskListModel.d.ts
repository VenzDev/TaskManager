export interface TaskModel {
  id: number;
  text: string;
  date: string;
}

export interface TaskListModel {
  id: number;
  text: string;
  list: Array<TaskModel>;
}
