import axios from "../axios";

export const createShippingAddress = async ({ id, data }) => {
  const res = await axios.post(`/api/profile/admin/address/${id}/`, data);
  return res.data;
};

export const getAddresses = async () => {
  const res = await axios.get("/api/profile/address-meta/");
  return res.data.data;
};

export const getAddressById = async (id) => {
  const res = await axios.get(`/api/profile/admin/address/${id}/`);
  return res.data;
};

export const getMetaCityAddress = async (id) => {
  const res = await axios.get(`/api/profile/admin/address-meta-city/${id}/`);
  return res.data;
};
