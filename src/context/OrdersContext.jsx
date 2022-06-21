import axios from "../myaxios";

export const getOrders = async () => {
  const res = await axios.get("/api/order/admin/orders");
  return res.data.data.results;
};

export const getOrder = async (orderId) => {
  const res = await axios.get(`/api/order/admin/order/${orderId}`);
  return res.data.data;
};

export const updateOrderStatus = async ({ orderId, status }) => {
  const res = await axios.put(`/api/order/admin/order/${orderId}/`, {
    status,
  });
  return res.data.data;
};
