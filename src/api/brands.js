import axios from "../axios";

export const getAllBrands = async () => {
  const res = await axios.get("/api/product/admin/brands/");
  return res.data.data.results;
};
