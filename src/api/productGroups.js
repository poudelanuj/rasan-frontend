import axios from "../axios";

export const getAllProductGroups = async () => {
  const res = await axios.get("/api/product/admin/product-groups/");
  return res.data.data.results;
};
