import axios from "../axios";

export const getOrders = async ({ orderStatus, page, size }) => {
  const res = await axios.get(
    `/api/order/admin/orders/?status=${orderStatus}page=${page}&size=${size}`
  );
  return res.data.data;
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
