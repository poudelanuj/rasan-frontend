import axios from "../axios";

export const getOrders = async () => {
  const res = await axios.get("/api/order/admin/orders/?page=1&size=100");

  let [nextUrl, page] = [res.data.data.next, 2];

  const allResData = [...res.data.data.results];

  while (nextUrl !== null) {
    const res = await axios.get(
      `/api/order/admin/orders/?page=${page}&size=100`
    );
    nextUrl = res.data.data.next;
    allResData.push(...res.data.data.results);
    page += 1;
  }

  if (allResData) return allResData;

  return res.data.data.results;
};

export const getAssignedOrder = async ({ orderStatus, page, pageSize }) => {
  const res = await axios.get(
    `/api/order/admin/orders/assigned/?status=${orderStatus}&page=${page}&size=${pageSize}`
  );
  return res.data.data;
};

export const getUserOrder = async ({
  orderStatus,
  user,
  page,
  pageSize,
  sort,
  search,
}) => {
  const res = await axios.get(
    `/api/order/admin/orders/?user=${user}&status=${orderStatus}&page=${page}&size=${pageSize}&sort=${
      sort || []
    }&search=${search || []}`
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
    `/api/order/admin/orders/?status=${orderStatus}&page=${page || 1}&size=${
      size || 20
    }&sort=${sort || []}&search=${search || ""}`
  );

  return res.data.data;
};

export const updateOrder = async (orderId, data) => {
  const res = await axios.put(`/api/order/admin/order/${orderId}/`, data);
  return res.data;
};

export const archiveBulkOrders = async (ids) => {
  const res = await axios.post("/api/order/admin/order/bulk-action/", {
    ids,
    action_type: "archive",
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
  const res = await axios.put(`/api/order/admin/payment/${paymentId}/`, data);
  return res.data;
};

export const updateOrderItem = async ({ orderId, itemId, data }) => {
  const res = await axios.put(
    `/api/order/admin/update-item-order/${orderId}/${itemId}/`,
    data
  );
  return res.data;
};
