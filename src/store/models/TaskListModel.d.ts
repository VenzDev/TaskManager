export interface TaskModel {
  id: string;
  text: string;
  date: string;
  favourite: boolean;
}

export interface TaskListModel {
  id: number;
  text: string;
  list: Array<TaskModel>;
}
