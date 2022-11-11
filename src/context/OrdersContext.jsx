import axios from "../axios";

export const getOrders = async () => {
  const res = await axios.get("/api/order/admin/orders");
  return res.data.data.results;
};

export const getOrder = async (orderId) => {
  const res = await axios.get(`/api/order/admin/order/${orderId}`);
  return res.data.data;
};

export const updateOrderStatus = async ({ orderId, status }) => {
  const res = await axios.put(`/api/order/admin/order/${orderId || []}/`, {
    status,
  });
  return res.data;
};

export const deleteBulkOrders = async (orderIds) => {
  const res = await axios.delete(`/api/order/admin/order/${orderIds}/`);

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

export const addOrderItem = async (orderId, data) => {
  const res = await axios.post(
    `/api/order/admin/add-item-order/${orderId}/`,
    data
  );
  return res.data;
};

export const getAllBaskets = async () => {
  const res = await axios.get("/api/order/admin/baskets");
  return res.data.data.results;
};

export const getBasketInfo = async (basketId) => {
  const res = await axios.get(`/api/order/admin/basket/${basketId}`);
  return res.data.data;
};

export const getUserInfo = async (userId) => {
  const res = await axios.get(`/api/profile/admin/user-profile/${userId}/`);
  return res.data.data;
};

export const addBasketItem = async (data) => {
  const res = await axios.post("/api/order/admin/basket-items/", data);
  return res.data;
};

export const deleteBasketItem = async (itemId) => {
  const res = await axios.delete(`/api/order/admin/basket-item/${itemId}/`);
  return res.data;
};
