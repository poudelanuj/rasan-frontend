import axios from "../myaxios";

export const getProductPack = async (slug) => {
  const res = await axios.get(`/api/product/admin/product-packs/${slug}/`);
  return res.data.data;
};
