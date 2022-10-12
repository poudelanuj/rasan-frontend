import axios from "../axios";

export const getUsers = async (page, search, pageSize, sort) => {
  const res = await axios.get(
    `/api/profile/admin/user-list/?page=${page || 1}&search=${
      search || ""
    }&size=${pageSize || 20}&sort=${sort || []}`
  );

  return res.data.data;
};

export const getEndUser = async () => {
  const response = await axios.get("/api/profile/");
  return response.data.data;
};

export const createUser = async (data) => {
  const response = await axios.post("/api/auth/create-user/admin/", data);
  return response.data;
};

export const getAdminUsers = async (groupIds, page, pageSize, search, sort) => {
  const res = await axios.get(
    `/api/profile/admin/user-list/?group_ids=${groupIds}&page=${page}&size=${
      pageSize || 20
    }&search=${search || ""}&sort=${sort || []}`
  );

  return res.data.data;
};
