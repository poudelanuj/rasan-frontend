import axios from "../myaxios";

export const getProductPack = async (id) => {
  const res = await axios.get(`/api/product/admin/product-packs/${id}/`);
  return res.data.data;
};

export const createProductPack = async (data) => {
  const res = await axios.post("/api/product/admin/product-packs/", data);
  return res.data;
};

export const deleteProductPack = async (id) => {
  const res = await axios.delete(`/api/product/admin/product-packs/${id}/`);
  return res.data;
};

export const updateProductPack = async (id, data) => {
  const res = await axios.put(`/api/product/admin/product-packs/${id}/`, data);
  return res.data;
};
