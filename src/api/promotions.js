import axios from "../axios";

export const getPromotions = async () => {
  const res = await axios.get("/api/promotion/admin/promotions/");
  return res.data.data.results;
};

export const getPaginatedPromotions = async (page, pageSize) => {
  const res = await axios.get(
    `/api/promotion/admin/promotions/?page=${page || 1}&size=${pageSize || 20}`
  );
  return res.data.data;
};

export const postPromotions = async (data) => {
  const res = await axios.post("/api/promotion/admin/promotions/", data);
  return res.data;
};

export const getPromotionsById = async (id) => {
  const res = await axios.get(`/api/promotion/admin/promotions/${id}/`);
  return res.data.data;
};

export const updatePromotions = async ({ id, data }) => {
  const res = await axios.put(`/api/promotion/admin/promotions/${id}/`, data);
  return res.data;
};

export const deletePromotions = async (ids) => {
  const res = await axios.delete(`/api/promotion/admin/promotions/${ids}/`);
  return res.data;
};

export const publishPromotions = async ({ id, shouldPublish }) => {
  if (shouldPublish) {
    const res = await axios.post(
      `/api/promotion/admin/promotions/${id}/publish/`
    );
    return res.data;
  } else {
    const res = await axios.delete(
      `/api/promotion/admin/promotions/${id}/publish/`
    );
    return res.data;
  }
};

// *Banners
export const getAllBanners = async () => {
  const res = await axios.get("/api/promotion/admin/banners/");
  return res.data.data.results;
};

export const postBanners = async (data) => {
  const res = await axios.post("/api/promotion/admin/banners/", data);
  return res.data;
};

export const getBannersById = async (id) => {
  const res = await axios.get(`/api/promotion/admin/banners/${id}/`);
  return res.data.data;
};

export const updateBanners = async ({ id, data }) => {
  const res = await axios.put(`/api/promotion/admin/banners/${id}/`, data);
  return res.data;
};

export const deleteBanners = async (id) => {
  const res = await axios.delete(`/api/promotion/admin/banners/${id}/`);
  return res.data;
};

export const publishBanners = async ({ id, shouldPublish }) => {
  if (shouldPublish) {
    const res = await axios.post(`/api/promotion/admin/banners/${id}/publish/`);
    return res.data;
  } else {
    const res = await axios.delete(
      `/api/promotion/admin/banners/${id}/publish/`
    );
    return res.data;
  }
};
