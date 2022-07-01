import axios from "../myaxios";

export const createProductSku = async (data) => {
  const res = await axios.post("/api/product/admin/product-skus/", data);
  return res.data;
};
