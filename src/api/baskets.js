import axios from "../axios";

export const getAllBaskets = async (page, pageSize) => {
  const res = await axios.get(
    `/api/order/admin/baskets/?page=${page || 1}&size=${pageSize || 20}`
  );
  return res.data.data;
};
