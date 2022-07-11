import axios from "../axios";

export const getOrders = async () => {
  const res = await axios.get("/api/order/admin/orders");
  return res.data.data.results;
};
