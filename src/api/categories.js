import axios from "../axios";

export const getAllCategories = async () => {
  const res = await axios.get("/api/product/admin/categories/");
  return res.data.data.results;
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
    return res;
  } else {
    const res = await axios.delete(
      `/api/product/admin/categories/publish/${slug}/`
    );
    return res;
  }
};
