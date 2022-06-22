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

export const deleteBulkOrders = async (orderIds = []) => {
  const res = await Promise.all(
    orderIds.map(async (id) => {
      const res = await axios.delete(`/api/order/admin/order/${id}/`);
      return res;
    })
  );

  return res.data;
};

export const getUserList = async () => {
  const res = await axios.get("/api/profile/admin/user-list");
  return res.data.data.results;
};

export const createOrder = async (data) => {
  const res = await axios.post("/api/order/admin/orders/", data);
  return res.data;
};

export const deleteOrder = async (orderId) => {
  const res = await axios.delete(`/api/order/admin/order/${orderId}/`);
  return res.data;
};

export const deleteOrderItem = async (orderId, itemId) => {
  const res = await axios.delete(
    `/api/order/admin/remove-item-order/${orderId}/${itemId}/`
  );
  return res.data;
};

export const getProductSkus = async () => {
  const res = await axios.get("/api/product/product-skus/");
  return res.data.data.results;
};

export const addOrderItem = async (orderId, data) => {
  const res = await axios.post(
    `/api/order/admin/add-item-order/${orderId}/`,
    data
  );
  return res.data;
};
