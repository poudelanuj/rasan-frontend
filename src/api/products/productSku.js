import axios from "../../axios";

export const getAllProductSkus = async () => {
  const res = await axios.get("/api/product/admin/product-skus/");
  return res.data.data.results;
};

export const getDropdownProductSkus = async () => {
  const res1 = await axios.get("/api/product/product-skus/");

  if (res1.data.data.next !== null) {
    const res2 = await axios.get(
      `/api/product/product-skus/?page=1&size=${res1.data.data.count}`
    );
    return res2.data.data.results;
  }

  return res1.data.data.results;
};

export const getPaginatedProdctSkus = async (page, pageSize) => {
  const res = await axios.get(
    `/api/product/admin/products/?page=${page || 1}&size=${pageSize || 20}`
  );
  return res.data.data;
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
