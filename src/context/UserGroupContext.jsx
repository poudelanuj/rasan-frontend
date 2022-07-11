import axios from "../axios";

export const getUserGroup = async () => {
  const response = await axios.get("/api/auth/group/");
  return response.data.data.results;
};
export const getGroupDetail = async (group_id) => {
  const response = await axios.get("/api/auth/group/" + group_id + "/");
  return response.data.data;
};

export const updateGroupDetail = async ({ data, key }) => {
  const response = await axios.put("/api/auth/group/" + key + "/", data);
  return response.data;
};

export const getPermission = async () => {
  const response = await axios.get("/api/auth/permission/");
  return response.data.data.results;
};
