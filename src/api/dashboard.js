import axios from "../axios";

export const getOrdersAssignedToMe = async () => {
  const res = await axios.get("/api/order/admin/orders/assigned/");
  return res.data.data.results;
};

export const getTicketsAssignedToMe = async () => {
  const res = await axios.get("/api/crm/admin/ticket/assigned/");
  return res.data.data.results;
};
