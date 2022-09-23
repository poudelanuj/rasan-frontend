import axios from "../axios";

export const getAllBaskets = async (page, pageSize) => {
  const res = await axios.get(
    `/api/order/admin/baskets/?page=${page || 1}&size=${pageSize || 20}`
  );
  return res.data.data;
};

export const getUserBasket = async (user, page, pageSize) => {
  const res = await axios.get(
    `/api/order/admin/baskets/?user=${user}&page=${page}&size=${pageSize}`
  );

  return res.data.data;
};
