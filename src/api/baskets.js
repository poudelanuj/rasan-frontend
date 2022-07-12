import axios from "../axios";

export const getAllBaskets = async () => {
  const res = await axios.get("/api/order/admin/baskets/");
  return res.data.data.results;
};
