import axios from "../axios";

export const getLoyaltyPolicies = async () => {
  const res = await axios.get("/api/loyalty/admin/loyalty-policies/");
  return res.data.data.results;
};
