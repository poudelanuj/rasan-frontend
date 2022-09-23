import axios from "../../axios";

const getAllUserFeedbacks = async ({ isArchived, page, pageSize }) => {
  if (isArchived) {
    const res = await axios.get(
      `/api/crm/admin/feedback/?is_archived=True&page=${page}&size=${pageSize}`
    );

    return res.data.data;
  } else {
    const res = await axios.get(
      `/api/crm/admin/feedback/?page=${page}&size=${pageSize}`
    );

    return res.data.data;
  }
};

export default getAllUserFeedbacks;
