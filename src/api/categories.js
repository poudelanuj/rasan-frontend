import axios from "../axios";

export const getAllCategories = async () => {
  const res = await axios.get("/api/product/admin/categories/");
  return res.data.data.results;
};
