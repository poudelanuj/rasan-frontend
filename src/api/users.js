import axios from "../axios";

export const getUsers = async () => {
  const res = await axios.get("/api/profile/admin/user-list/");
  return res.data.data.results;
};

export const getEndUser = async () => {
  const response = await axios.get("/api/profile/");
  return response.data.data;
};

export const createUser = async (data) => {
  const res = await axios.post("/api/auth/create-user/admin/", data);
  return res.data;
};
