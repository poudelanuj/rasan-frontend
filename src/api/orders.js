import axios from "../axios";

export const getOrders = async () => {
  const res = await axios.get("/api/order/admin/orders");
  return res.data.data.results;
};

export const getFilteredOrders = async ({ status }) => {
  const res = await axios.get(`/api/order/admin/orders/?status=${status}`);
  return res.data.data.results;
};

export const updateOrder = async (orderId, data) => {
  const res = await axios.put(`/api/order/admin/order/${orderId}/`, data);
  return res.data;
};

export const getOrderMetrics = async (timeKey) => {
  const res = await axios.get(
    `/api/order/admin/orders/metrics/?time_key=${timeKey}`
  );
  return res.data.data;
};

export const updateOrderPayment = async (paymentId, data) => {
  const res = await axios.put(`/api/order/admin/payment/${paymentId}/`);
  return res.data;
};
