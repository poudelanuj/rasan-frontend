import axios from "../../axios";

export const getAllProductSkus = async () => {
  const res = await axios.get("/api/product/admin/product-skus/");
  return res.data.data.results;
};

export const getDropdownProductSkus = async () => {
  const res1 = await axios.get(
    "/api/product/admin/product-skus/?page=1&size=100"
  );
  const res2 = await axios.get(
    `/api/product/admin/product-skus/?page=2&size=${
      res1.data.data.count - res1.data.data.results.length
    }`
  );

  return [...res1.data.data.results, ...res2.data.data.results];
};

export const getProductSku = async (slug) => {
  const res = await axios.get(`/api/product/admin/product-skus/${slug}/`);
  return res.data.data;
};

export const createProductSku = async (data) => {
  const res = await axios.post("/api/product/admin/product-skus/", data);
  return res.data;
};

export const updateProductSku = async (slug, data) => {
  const res = await axios.put(`/api/product/admin/product-skus/${slug}/`, data);
  return res.data;
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
