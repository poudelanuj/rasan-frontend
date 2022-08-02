import axios from "../axios";

export const getAllCategories = async () => {
  const res = await axios.get("/api/product/admin/categories/");
  return res.data.data.results;
};

export const getPaginatedCategories = async (page, pageSize) => {
  const res = await axios.get(
    `/api/product/admin/categories/?page=${page || 1}&size=${pageSize || 20}`
  );
  return res.data.data;
};

export const getCategory = async (slug) => {
  const res = await axios.get(`/api/product/admin/categories/${slug}/`);
  return res.data.data;
};

export const publishCategory = async ({ slug, shouldPublish }) => {
  if (shouldPublish) {
    // * publish
    const res = await axios.post(
      `/api/product/admin/categories/publish/${slug}/`
    );
    return res.data;
  } else {
    // * unpublish
    const res = await axios.delete(
      `/api/product/admin/categories/publish/${slug}/`
    );
    return res.data;
  }
};

export const bulkPublish = async ({ slugs = [], isPublish }) => {
  if (isPublish) {
    // * Publish
    const res = await Promise.all(
      slugs.map(
        async (slug) =>
          await axios.post(`/api/product/admin/categories/publish/${slug}/`)
      )
    );
    return res;
  } else {
    // * Unpublish
    const res = await Promise.all(
      slugs.map(
        async (slug) =>
          await axios.delete(`/api/product/admin/categories/publish/${slug}/`)
      )
    );
    return res;
  }
};

export const bulkDelete = async (slugs = []) => {
  const res = await Promise.all(
    slugs.map(async (slug) => {
      return await axios.delete(`/api/product/admin/categories/${slug}/`);
    })
  );
  return res.data;
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
