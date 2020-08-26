import axios from "axios";
const url = "http://www.mocky.io/v2/5e0de1893300002b00aa88f3";

export const getUsers = async () => {
  const fetchedData = await axios.get(url);
  return fetchedData.data;
};
