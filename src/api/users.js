import axios from "../axios";

export const getUsers = async () => {
  const res1 = await axios.get("/api/profile/admin/user-list/");

  if (res1.data.data.next !== null) {
    const res2 = await axios.get(
      `/api/profile/admin/user-list/?page=1&size=${res1.data.data.count}`
    );
    return res2.data.data.results;
  }

  return res1.data.data.results;
};

export const getEndUser = async () => {
  const response = await axios.get("/api/profile/");
  return response.data.data;
};

export const createUser = async (data) => {
  const response = await axios.post("/api/auth/create-user/admin/", data);
  return response.data;
};
