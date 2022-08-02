import axios from "../../axios";

export const getAllProductGroups = async () => {
  const res = await axios.get("/api/product/admin/product-groups/");
  return res.data.data.results;
};

export const getProductGroup = async (slug) => {
  const res = await axios.get(`/api/product/admin/product-groups/${slug}/`);
  return res.data.data;
};

export const getPaginatedProductGroups = async (page, pageSize) => {
  const res = await axios.get(
    `/api/product/admin/product-groups/?page=${page || 1}&size=${
      pageSize || 20
    }`
  );
  return res.data.data;
};

export const publishProductGroup = async ({ slug, shouldPublish }) => {
  if (shouldPublish) {
    const res = await axios.post(
      `/api/product/admin/product-groups/publish/${slug}/`
    );
    return res.data;
  } else {
    const res = await axios.delete(
      `/api/product/admin/product-groups/publish/${slug}/`
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
          await axios.post(`/api/product/admin/product-groups/publish/${slug}/`)
      )
    );
    return res;
  } else {
    // * Unpublish
    const res = await Promise.all(
      slugs.map(
        async (slug) =>
          await axios.delete(
            `/api/product/admin/product-groups/publish/${slug}/`
          )
      )
    );
    return res;
  }
};

export const bulkDelete = async (slugs = []) => {
  const res = await Promise.all(
    slugs.map(async (slug) => {
      return await axios.delete(`/api/product/admin/product-groups/${slug}/`);
    })
  );
  return res.data;
};

export const updateProductGroup = async ({ slug, form_data }) => {
  const res = await axios.put(
    `/api/product/admin/product-groups/${slug}/`,
    form_data
  );
  return res.data;
};

export const deleteProductGroup = async ({ slug }) => {
  const res = await axios.delete(`/api/product/admin/product-groups/${slug}/`);
  return res.data;
};
