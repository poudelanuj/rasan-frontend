import axios from "../axios";

export const getAllBrands = async () => {
  const res = await axios.get("/api/product/admin/brands/");
  return res.data.data.results;
};

export const getPaginatedBrands = async (page, pageSize) => {
  const res = await axios.get(
    `/api/product/admin/brands/?page=${page || 1}&size=${pageSize || 20}`
  );
  return res.data.data;
};

export const getProductsFromBrand = async (brandSlug, page, pageSize) => {
  const res = await axios.get(
    `/api/product/admin/brands/products/${brandSlug}/?page=${page || 1}&size=${
      pageSize || 20
    }`
  );
  return res.data.data;
};

export const getProductSkusFromBrand = async (brandSlug, page, pageSize) => {
  const res = await axios.get(
    `/api/product/admin/brands/product-skus/${brandSlug}/?page=${
      page || 1
    }&size=${pageSize || 20}`
  );
  return res.data.data;
};

export const getBrand = async (slug) => {
  const res = await axios.get(`/api/product/admin/brands/${slug}/`);
  return res.data.data;
};

export const createBrand = async (data) => {
  const res = await axios.post(`/api/product/admin/brands/`, data);
  return res.data;
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

export const bulkPublish = async ({ slugs = [], isPublish }) => {
  if (isPublish) {
    // * Publish Brand
    const res = await Promise.all(
      slugs.map(
        async (slug) =>
          await axios.post(`/api/product/admin/brands/publish/${slug}/`)
      )
    );
    return res;
  } else {
    // * Unpublish Brand
    const res = await Promise.all(
      slugs.map(
        async (slug) =>
          await axios.delete(`/api/product/admin/brands/publish/${slug}/`)
      )
    );
    return res;
  }
};

export const bulkDelete = async (slugs = []) => {
  const res = await Promise.all(
    slugs.map(async (slug) => {
      return await axios.delete(`/api/product/admin/brands/${slug}/`);
    })
  );
  return res.data;
};
