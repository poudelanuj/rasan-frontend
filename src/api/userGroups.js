import axios from "../axios";

export const getUserGroups = async () => {
  const res = await axios.get("/api/auth/group/");
  return res.data.data.results;
};
