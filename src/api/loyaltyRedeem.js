import axios from "../axios";

export const getRedeemableProduct = async () => {
  const res = await axios.get(`/api/loyalty-redeem/admin/products/`);
  return res.data.data.results;
};

export const getRedeemableProductById = async (id) => {
  const res = await axios.get(`/api/loyalty-redeem/admin/product/${id}/`);
  return res.data.data;
};

export const createReedemableProduct = async (data) => {
  const res = await axios.post("/api/loyalty-redeem/admin/products/", data);
  return res.data;
};

export const updateReedemableProduct = async ({ id, data }) => {
  const res = await axios.put(`/api/loyalty-redeem/admin/product/${id}/`, data);
  return res.data;
};

export const deleteReedemableProduct = async (ids = []) => {
  const res = await Promise.all(
    ids.map(
      async (id) =>
        await axios.delete(`/api/loyalty-redeem/admin/product/${id}/`)
    )
  );
  return res;
};

export const publishReedemableProduct = async ({ id, shouldPublish }) => {
  if (shouldPublish) {
    const res = await axios.post(
      `/api/loyalty-redeem/admin/product/${id}/publish/`
    );
    return res.data;
  } else {
    const res = await axios.delete(
      `/api/loyalty-redeem/admin/product/${id}/publish/`
    );
    return res.data;
  }
};

export const archiveReedemableProduct = async ({ id, shouldArchive }) => {
  if (shouldArchive) {
    const res = await axios.post(
      `/api/loyalty-redeem/admin/product/${id}/archive/`
    );
    return res.data;
  } else {
    const res = await axios.delete(
      `/api/loyalty-redeem/admin/product/${id}/archive/`
    );
    return res.data;
  }
};
