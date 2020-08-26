import UserModel from "./UserModel";

export interface TaskModel {
  id: string;
  text: string;
  date: string;
  favourite: boolean;
  description: string | null;
  user: UserModel | null;
}

export interface TaskListModel {
  id: number;
  text: string;
  list: Array<TaskModel>;
}
