import axios from "../axios";

export const getLuckyDraw = async () => {
  const res = await axios.get(`/api/lucky-draw/admin/events/`);
  return res.data.data.results;
};

export const getPaginatedLuckyDraw = async (page, pageSize) => {
  const res = await axios.get(
    `/api/lucky-draw/admin/events/?page=${page || 1}&size=${pageSize || 20}`
  );
  return res.data.data;
};

export const getLuckyDrawById = async (id) => {
  const res = await axios.get(`/api/lucky-draw/admin/event/${id}/`);
  return res.data.data;
};

export const createLuckyDraw = async (data) => {
  const res = await axios.post("/api/lucky-draw/admin/events/", data);
  return res.data;
};

export const updateLuckyDraw = async ({ id, data }) => {
  const res = await axios.put(`/api/lucky-draw/admin/event/${id}/`, data);
  return res.data;
};

export const deleteLuckyDraw = async (ids) => {
  const res = await axios.delete(`/api/lucky-draw/admin/event/${ids}/`);

  return res.data;
};

export const deleteBulkLuckyDraw = async (ids) => {
  const res = await axios.post("/api/lucky-draw/admin/event/bulk-action/", {
    ids,
    action_type: "delete",
  });
  return res.data;
};

export const activateLuckyDraw = async ({ id, shouldActivate }) => {
  if (shouldActivate) {
    const res = await axios.post(`/api/lucky-draw/admin/event/${id}/activate/`);
    return res.data;
  } else {
    const res = await axios.delete(
      `/api/lucky-draw/admin/event/${id}/activate/`
    );
    return res.data;
  }
};

export const archiveLuckyDraw = async ({ id, shouldArchive }) => {
  if (shouldArchive) {
    const res = await axios.post(`/api/lucky-draw/admin/event/${id}/archive/`);
    return res.data;
  } else {
    const res = await axios.delete(
      `/api/lucky-draw/admin/event/${id}/archive/`
    );
    return res.data;
  }
};

export const deleteCoupon = async (ids = []) => {
  const res = await Promise.all(
    ids.map(
      async (id) => await axios.delete(`/api/lucky-draw/admin/coupon/${id}/`)
    )
  );
  return res;
};
