import axios from "../../axios";

export const getAllProductSkus = async () => {
  const res = await axios.get(
    "/api/product/admin/product-skus/?page=1&size=100"
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

export const getPaginatedProdctSkus = async (page, pageSize, sort, search) => {
  const res = await axios.get(
    `/api/product/admin/product-skus/?page=${page || 1}&size=${
      pageSize || 20
    }&sort=${sort || []}&name__icontains=${search || ""}`
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

export const deleteProductSku = async (slug) => {
  const res = await axios.delete(`/api/product/admin/product-skus/${slug}/`);
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

// * Bulk Publish/Unpublish Product Skus
export const bulkPublish = async ({ slugs = [], isPublish }) => {
  if (isPublish) {
    // * Publish
    const res = await Promise.all(
      slugs.map(
        async (slug) =>
          await axios.post(`/api/product/admin/product-skus/publish/${slug}/`)
      )
    );
    return res;
  } else {
    // * Unpublish
    const res = await Promise.all(
      slugs.map(
        async (slug) =>
          await axios.delete(`/api/product/admin/product-skus/publish/${slug}/`)
      )
    );
    return res;
  }
};

// * Bulk Product Sku Delete
export const bulkDelete = async (slugs = []) => {
  const res = await Promise.all(
    slugs.map(async (slug) => {
      return await axios.delete(`/api/product/admin/product-skus/${slug}/`);
    })
  );
  return res.data;
};
