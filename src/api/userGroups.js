import axios from "../axios";

export const getUserGroups = async () => {
  const res = await axios.get("/api/auth/group/");
  return res.data.data.results;
};

export const getUserGroupsById = async (ids = []) => {
  const res = await Promise.all(
    ids.map(async (id) => await axios.get(`/api/auth/group/${id}/`))
  );
  return res;
};

export const createUserGroup = async (data) => {
  const res = await axios.post("/api/auth/group/", data);
  return res.data;
};

export const deleteUserGroup = async (id) => {
  const res = await axios.delete(`/api/auth/group/${id}/`);
  return res.data;
};

export const updateUserGroup = async ({ id, data }) => {
  const res = await axios.put(`/api/auth/group/${id}/`, data);
  return res.data;
};

export const getPermission = async () => {
  const res1 = await axios.get("/api/auth/permission/");

  if (res1.data.data.next !== null) {
    const res2 = await axios.get(
      `/api/auth/permission/?page=1&size=${res1.data.data.count}`
    );
    return res2.data.data.results;
  }

  return res1.data.data.results;
};

export const addUser = async ({ id, data }) => {
  const res = await axios.post(`/api/auth/group/${id}/add-users/`, data);
  return res.data;
};

export const removeUser = async ({ id, data }) => {
  const res = await axios.delete(`/api/auth/group/${id}/add-users/`, data);
  return res.data;
};

export const sendNotification = async (id) => {
  const res = await axios.post(
    `/api/notification/admin/groups/${id}/update_dispatched/`
  );

  return res.data;
};
