import axios from "../axios";

export const createShippingAddress = async (id, data) => {
  const res = await axios.post(`/api/profile/admin/address/${id}/`, data);
  return res.data;
};
