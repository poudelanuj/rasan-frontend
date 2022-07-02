import axios from "../myaxios";

export const getAllBrands = async () => {
  const res = await axios.get("/api/product/admin/brands/");
  return res.data.data.results;
};
