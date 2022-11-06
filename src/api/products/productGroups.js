import axios from "../../axios";

export const getAllProductGroups = async () => {
  const res = await axios.get(
    "/api/product/admin/product-groups/?page=1&size=100"
  );

  let [nextUrl, page] = [res.data.data.next, 2];

  const allResData = [...res.data.data.results];

  while (nextUrl !== null) {
    const res = await axios.get(
      `/api/product/admin/product-skus/?page=${page}&size=100`
    );
    nextUrl = res.data.data.next;
    allResData.push(...res.data.data.results);
    page += 1;
  }

  if (allResData) return allResData;

  return res.data.data.results;
};

export const getProductGroup = async (slug) => {
  const res = await axios.get(`/api/product/admin/product-groups/${slug}/`);
  return res.data.data;
};

export const getPaginatedProductGroups = async (page, pageSize, search) => {
  const res = await axios.get(
    `/api/product/admin/product-groups/?page=${page || 1}&size=${
      pageSize || 20
    }&search=${search || ""}`
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

export const bulkDelete = async (slugs) => {
  const res = await axios.delete(`/api/product/admin/product-groups/${slugs}/`);

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
