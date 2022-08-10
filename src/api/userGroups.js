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
