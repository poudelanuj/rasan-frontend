import axios from "../axios";

export const getUsers = async () => {
  const res = await axios.get("/api/profile/admin/user-list/");
  return res.data.data.results;
};
