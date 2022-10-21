import axios from "../../axios";

export const getAllProducts = async () => {
  const res = await axios.get("/api/product/admin/products/");
  return res.data.data.results;
};

export const getPaginatedProducts = async (
  page,
  pageSize,
  sort,
  search,
  brand,
  category
) => {
  const res = await axios.get(
    `/api/product/admin/products/?page=${page || 1}&size=${
      pageSize || 20
    }&sort=${sort}&name__icontains=${search || ""}&brand=${
      brand || []
    }&category=${category || []}`
  );
  return res.data.data;
};

export const createProduct = async (data) => {
  const res = await axios.post("/api/product/admin/products/", data);
  return res.data;
};

export const deleteProduct = async (slug) => {
  const res = await axios.delete(`/api/product/admin/products/${slug}/`);
  return res.data;
};

export const getProduct = async (slug) => {
  const res = await axios.get(`/api/product/admin/products/${slug}`);
  return res.data.data;
};

export const updateProduct = async (slug, data) => {
  const res = await axios.put(`/api/product/admin/products/${slug}/`, data);
  return res.data;
};

export const publishProduct = async (slug) => {
  const res = await axios.post(`/api/product/admin/products/publish/${slug}/`);
  return res.data;
};

export const unpublishProduct = async (slug) => {
  const res = await axios.delete(
    `/api/product/admin/products/publish/${slug}/`
  );
  return res.data;
};

// * Bulk Publish/Unpublish Products
export const bulkPublish = async ({ slugs = [], isPublish }) => {
  if (isPublish) {
    // * Publish
    const res = await Promise.all(
      slugs.map(
        async (slug) =>
          await axios.post(`/api/product/admin/products/publish/${slug}/`)
      )
    );
    return res;
  } else {
    // * Unpublish
    const res = await Promise.all(
      slugs.map(
        async (slug) =>
          await axios.delete(`/api/product/admin/products/publish/${slug}/`)
      )
    );
    return res;
  }
};

// * Bulk Products Delete
export const bulkDelete = async (slugs = []) => {
  const res = await Promise.all(
    slugs.map(async (slug) => {
      return await axios.delete(`/api/product/admin/products/${slug}/`);
    })
  );
  return res.data;
};
