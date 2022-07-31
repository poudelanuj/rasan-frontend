import axios from "../axios";

export const getUsers = async () => {
  const res1 = await axios.get("/api/profile/admin/user-list/?page=1&size=100");
  const res2 = await axios.get(
    `/api/profile/admin/user-list/?page=2&size=${
      res1.data.data.count - res1.data.data.results.length
    }`
  );

  return [...res1.data.data.results, ...res2.data.data.results];
};

export const getEndUser = async () => {
  const response = await axios.get("/api/profile/");
  return response.data.data;
};

export const createUser = async (data) => {
  const response = await axios.post("/api/auth/create-user/admin/", data);
  return response.data;
};
