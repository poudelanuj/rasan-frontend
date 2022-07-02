import axios from "../myaxios";

export const createProductSku = async (data) => {
  const res = await axios.post("/api/product/admin/product-skus/", data);
  return res.data;
};

export const getProductSku = async (slug) => {
  const res = await axios.get(`/api/product/admin/product-skus/${slug}/`);
  return res.data.data;
};

export const publishProductSku = async (slug) => {
  const res = await axios.post(
    `/api/product/admin/product-skus/publish/${slug}/`
  );
  return res.data;
};

export const unpublishProductSku = async (slug) => {
  const res = await axios.delete(
    `/api/product/admin/product-skus/publish/${slug}/`
  );
  return res.data;
};
