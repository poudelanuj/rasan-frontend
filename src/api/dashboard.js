import axios from "../axios";

export const getOrdersAssignedToMe = async ({
  page,
  pageSize,
  sort,
  search,
  status,
}) => {
  const res = await axios.get(
    `/api/order/admin/orders/assigned/?page=${page || 1}&size=${
      pageSize || 20
    }&sort=${sort || []}&user=${search || ""}&status=${status || "all"}`
  );
  return res.data.data;
};

export const getTicketsAssignedToMe = async ({ page, pageSize, sort }) => {
  const res = await axios.get(
    `/api/crm/admin/ticket/assigned/?page=${page | 1}&size=${
      pageSize || 20
    }&sort=${sort || []}`
  );
  return res.data.data;
};
