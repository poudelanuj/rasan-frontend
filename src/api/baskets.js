import axios from "../axios";

export const getAllBaskets = async (page, pageSize, search, sort) => {
  const res = await axios.get(
    `/api/order/admin/baskets/?page=${page || 1}&size=${
      pageSize || 20
    }&search=${search || ""}&sort=${sort || []}`
  );
  return res.data.data;
};

export const getUserBasket = async (user, page, pageSize) => {
  const res = await axios.get(
    `/api/order/admin/baskets/?user=${user || ""}&page=${page || 1}&size=${
      pageSize || 20
    }`
  );

  return res.data.data;
};

export const deleteBulkUserBasket = async (ids) => {
  const res = await axios.post("/api/order/admin/basket/bulk-action/", {
    ids,
    action_type: "delete",
  });

  return res.data;
};
