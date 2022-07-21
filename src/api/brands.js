import axios from "../axios";

export const getAllBrands = async () => {
  const res = await axios.get("/api/product/admin/brands/");
  return res.data.data.results;
};

export const getBrand = async (slug) => {
  const res = await axios.get(`/api/product/admin/brands/${slug}/`);
  return res.data.data;
};

export const publishBrand = async ({ slug, shouldPublish }) => {
  if (shouldPublish) {
    const res = await axios.post(`/api/product/admin/brands/publish/${slug}/`);
    return res;
  } else {
    const res = await axios.delete(
      `/api/product/admin/brands/publish/${slug}/`
    );
    return res;
  }
};
