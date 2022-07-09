import axios from "../../myaxios";

const getAllUserFeedbacks = async () => {
  const res = await axios.get("/api/crm/admin/feedback/");
  return res.data.data.results;
};

export default getAllUserFeedbacks;
