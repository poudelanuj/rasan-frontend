import axios from "../myaxios";

export const getAllProducts = async () => {
  const res = await axios.get("/api/product/admin/products/");
  return res.data.data.results;
};

export const getPaginatedProducts = async (page) => {
  const res = await axios.get(`/api/product/admin/products/?page=${page || 1}`);
  return res.data.data;
};

export const createProduct = async (data) => {
  const res = await axios.post("/api/product/admin/products/", data);
  return res.data;
};

export const getProduct = async (slug) => {
  const res = await axios.get(`/api/product/admin/products/${slug}`);
  return res.data.data;
};

export const updateProduct = async (slug, data) => {
  const res = await axios.put(`/api/product/admin/products/${slug}/`, data);
  return res.data;
};

export const publishProduct = async (slug) => {
  const res = await axios.post(`/api/product/admin/products/publish/${slug}/`);
  return res.data;
};

export const unpublishProduct = async (slug) => {
  const res = await axios.delete(
    `/api/product/admin/products/publish/${slug}/`
  );
  return res.data;
};
