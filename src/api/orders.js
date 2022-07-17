import axios from "../axios";

export const getOrders = async () => {
  const res = await axios.get("/api/order/admin/orders");
  return res.data.data.results;
};

export const updateOrder = async (orderId, data) => {
  const res = await axios.put(`/api/order/admin/order/${orderId}/`, data);
  return res.data;
};

export const getOrderMetrics = async () => {
  const res = await axios.get("/api/order/admin/orders/metrics");
  return res.data.data;
};
