import axios from "../myaxios";

export const getAllProductGroups = async () => {
  const res = await axios.get("/api/product/admin/product-groups/");
  return res.data.data.results;
};
