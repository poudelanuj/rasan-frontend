import axios from "../myaxios";

export const getAllCategories = async () => {
  const res = await axios.get("/api/product/admin/categories/");
  return res.data.data.results;
};

export const getAllBrands = async () => {
  const res = await axios.get("/api/product/admin/brands/");
  return res.data.data.results;
};

export const getAllProducts = async () => {
  const res = await axios.get("/api/product/admin/products/");
  return res.data.data.results;
};

export const getLoyaltyPolicies = async () => {
  const res = await axios.get("/api/loyalty/admin/loyalty-policies/");
  return res.data.data.results;
};

export const createProduct = async (data) => {
  const res = await axios.post("/api/product/admin/products/", data);
  return res.data;
};
