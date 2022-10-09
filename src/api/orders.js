import axios from "../axios";

export const getOrders = async () => {
  const res = await axios.get("/api/order/admin/orders");
  return res.data.data.results;
};

export const getAssignedOrder = async ({ orderStatus, page, pageSize }) => {
  const res = await axios.get(
    `/api/order/admin/orders/assigned/?status=${orderStatus}&page=${page}&size=${pageSize}`
  );
  return res.data.data;
};

export const getUserOrder = async ({ orderStatus, user, page, pageSize }) => {
  const res = await axios.get(
    `/api/order/admin/orders/?user=${user}&status=${orderStatus}&page=${page}&size=${pageSize}`
  );
  return res.data.data;
};

export const getPaginatedOrders = async ({
  orderStatus,
  page,
  size,
  sort,
  search,
}) => {
  const res = await axios.get(
    `/api/order/admin/orders/?status=${orderStatus}&page=${page}&size=${size}&sort=${sort}&user=${
      search || ""
    }`
  );

  return res.data.data;
};

export const updateOrder = async (orderId, data) => {
  const res = await axios.put(`/api/order/admin/order/${orderId}/`, data);
  return res.data;
};

export const deleteBulkOrders = async (ids) => {
  const res = await axios.post("/api/order/admin/order/bulk-action/", {
    ids,
    action_type: "delete",
  });
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
