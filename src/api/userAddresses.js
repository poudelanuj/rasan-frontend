import axios from "../axios";

export const createShippingAddress = async ({ id, data }) => {
  const res = await axios.post(`/api/profile/admin/address/${id}/`, data);
  return res.data;
};

export const getAddresses = async () => {
  const res = await axios.get("/api/profile/address-meta/");
  return res.data.data;
};
