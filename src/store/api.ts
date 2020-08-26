import axios from "axios";
import UserModel from "./models/UserModel";
const url = "http://www.mocky.io/v2/5e0de1893300002b00aa88f3";

export const getUsers = async () => {
  const fetchedData = await axios.get(url);
  return fetchedData.data;
};
export const getUser = async (id: number) => {
  const { data } = await axios.get(url);
  return data.filter((user: UserModel) => user.id === id)[0];
};
