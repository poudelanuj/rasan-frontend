import myaxios from "../myaxios";

export const getUserGroup = async () => {
  const response = await myaxios.get("/api/auth/group/");
  return response.data.data.results;
};
export const getGroupDetail = async (group_id) => {
  const response = await myaxios.get("/api/auth/group/" + group_id + "/");
  return response.data.data;
};

export const updateGroupDetail = async ({ data, key }) => {
  const response = await myaxios.put("/api/auth/group/" + key + "/", data);
  return response.data;
};

export const getPermission = async () => {
  const response = await myaxios.get("/api/auth/permission/");
  return response.data.data;
};
