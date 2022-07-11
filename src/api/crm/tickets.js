import axios from "../../axios";

const getAllTickets = async () => {
  const res = await axios.get("/api/crm/admin/tickets/");
  return res.data.data.results;
};

export const getTicket = async (ticketId) => {
  const res = await axios.get(`/api/crm/admin/ticket/${ticketId}/`);
  return res.data.data;
};

export const createTicket = async (data) => {
  const res = await axios.post("/api/crm/admin/tickets/", data);
  return res.data;
};

export const updateTicket = async (id, data) => {
  const res = await axios.put(`/api/crm/admin/ticket/${id}/`, data);
  return res.data;
};

export default getAllTickets;
