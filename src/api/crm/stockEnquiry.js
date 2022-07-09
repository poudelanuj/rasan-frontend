import axios from "../../myaxios";

const getAllStockEnquiries = async () => {
  const res = await axios.get("/api/crm/admin/notifications/");
  return res.data.data.results;
};

export default getAllStockEnquiries;
