import axios from "../axios";

export const getRedeemableProduct = async (type, isArchived) => {
  const res = await axios.get(
    `/api/loyalty-redeem/admin/products/?redeem_type=${type}&is_archived=${isArchived}`
  );
  return res.data.data.results;
};

export const getPaginatedRedeemableProduct = async (
  page,
  pageSize,
  type,
  isArchived
) => {
  const res = await axios.get(
    `/api/loyalty-redeem/admin/products/?redeem_type=${type}&is_archived=${isArchived}&page=${
      page || 1
    }&size=${pageSize || 20}`
  );
  return res.data.data;
};

export const getRedeemableProductById = async (id) => {
  const res = await axios.get(`/api/loyalty-redeem/admin/product/${id}/`);
  return res.data.data;
};

export const createRedeemableProduct = async (data) => {
  const res = await axios.post("/api/loyalty-redeem/admin/products/", data);
  return res.data;
};

export const updateRedeemableProduct = async ({ id, data }) => {
  const res = await axios.put(`/api/loyalty-redeem/admin/product/${id}/`, data);
  return res.data;
};

export const deleteRedeemableProduct = async (ids = []) => {
  const res = await Promise.all(
    ids.map(
      async (id) =>
        await axios.delete(`/api/loyalty-redeem/admin/product/${id}/`)
    )
  );
  return res;
};

export const publishRedeemableProduct = async ({ id, shouldPublish }) => {
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

export const archiveRedeemableProduct = async ({ id, shouldArchive }) => {
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
