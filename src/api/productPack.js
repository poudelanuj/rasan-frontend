import axios from "../myaxios";

export const getProductPack = async (slug) => {
  const res = await axios.get(`/api/product/admin/product-packs/${slug}/`);
  return res.data.data;
};

export const deleteProductPack = async (id) => {
  const res = await axios.delete(`/api/product/admin/product-packs/${id}/`);
  return res.data;
};
