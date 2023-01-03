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
  const res = await axios.get("/api/auth/permission/?page=1&size=100");

  let [nextUrl, page] = [res.data.data.next, 2];

  const allResData = [...res.data.data.results];

  while (nextUrl !== null) {
    const res = await axios.get(`/api/auth/permission/?page=${page}&size=100`);
    nextUrl = res.data.data.next;
    allResData.push(...res.data.data.results);
    page += 1;
  }

  if (allResData) return allResData;

  return res.data.data.results;
};

export const addUser = async ({ id, data }) => {
  const res = await axios.post(`/api/auth/group/${id}/add-users/`, data);
  return res.data;
};

export const removeUser = async ({ id, data }) => {
  const res = await axios.request({
    url: `/api/auth/group/${id}/add-users/`,
    method: "delete",
    data,
  });

  return res.data;
};

export const sendNotification = async (id) => {
  const res = await axios.post(
    `/api/notification/admin/groups/${id}/update_dispatched/`
  );

  return res.data;
};
