import axios from "../../axios";

export const getProductPack = async (id) => {
  const res = await axios.get(`/api/product/admin/product-packs/${id}/`);
  return res.data.data;
};

export const createProductPack = async (data) => {
  const res = await axios.post("/api/product/admin/product-packs/", data);
  return res.data;
};

export const deleteProductPack = async (id) => {
  const res = await axios.delete(`/api/product/admin/product-packs/${id}/`);
  return res.data;
};

export const updateProductPack = async (id, data) => {
  const res = await axios.put(`/api/product/admin/product-packs/${id}/`, data);
  return res.data;
};

export const publishProductPack = async (id) => {
  const res = await axios.post(
    `/api/product/admin/product-packs/publish/${id}/`
  );
  return res.data;
};

export const unpublishProductPack = async (id) => {
  const res = await axios.delete(
    `/api/product/admin/product-packs/publish/${id}/`
  );
  return res.data;
};

export const getProductPackCSV = async ({
  page,
  shouldPaginate,
  product_name,
  product_sku_name,
  pageSize,
  sort,
}) => {
  const res = await axios.get(
    `/api/product/admin/product-pack-csv/?page=${
      page || 1
    }&paginate=${shouldPaginate}&product_name=${
      product_name || ""
    }&product_sku_name=${product_sku_name || ""}&size=${pageSize || 20}&sort=${
      sort || []
    }`
  );

  return res.data.data;
};

export const postProductPackCSV = async (data) => {
  const res = await axios.post("/api/product/admin/product-pack-csv/", data);

  return res.data;
};
