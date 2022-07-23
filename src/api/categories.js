import axios from "../axios";

export const getAllCategories = async () => {
  const res = await axios.get("/api/product/admin/categories/");
  return res.data.data.results;
};

export const getPaginatedCategories = async (page, pageSize) => {
  const res = await axios.get(
    `/api/product/admin/categories/?page=${page}&size=${pageSize}`
  );
  return res.data.data;
};

export const getCategory = async (slug) => {
  const res = await axios.get(`/api/product/admin/categories/${slug}/`);
  return res.data.data;
};

export const publishCategory = async ({ slug, shouldPublish }) => {
  if (shouldPublish) {
    const res = await axios.post(
      `/api/product/admin/categories/publish/${slug}/`
    );
    return res.data;
  } else {
    const res = await axios.delete(
      `/api/product/admin/categories/publish/${slug}/`
    );
    return res.data;
  }
};

export const getProductsFromCategory = async ({
  categorySlug,
  page,
  pageSize,
}) => {
  const res = await axios.get(
    `/api/product/admin/categories/products/${categorySlug}/?page=${
      page || 1
    }&size=${pageSize || 10}`
  );
  return res.data.data.products;
};
