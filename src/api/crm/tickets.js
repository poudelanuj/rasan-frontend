import axios from "../../myaxios";

const getAllTickets = async () => {
  const res = await axios.get("/api/crm/admin/tickets/");
  return res.data.data.results;
};

export default getAllTickets;
