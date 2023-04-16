import axios from "../axios";

export const getUsers = async (
  page,
  search,
  pageSize,
  sort,
  { province, city, area }
) => {
  const res = await axios.get(
    `/api/profile/admin/user-list/?page=${page || 1}&search=${
      search || ""
    }&size=${pageSize || 20}&sort=${sort || []}&province=${
      province || ""
    }&area=${area || ""}&city=${city || ""}`
  );

  return res.data.data;
};

export const getEndUser = async () => {
  const response = await axios.get("/api/profile/");
  return response.data.data;
};

export const createUser = async (data) => {
  const response = await axios.post("/api/auth/create-user/admin/", data);
  return response.data;
};

export const createBulkUser = async (data) => {
  Promise.all(
    data.forEach(async (user) => {
      if (!user["VAT NO"]) delete user["VAT NO"];

      await axios.post(
        "/api/auth/create-user/admin/",
        (() => {
          if (user["VAT NO"])
            return {
              full_name: user["PARTY NAME"],
              phone: `+977-${user["MOBILE NO"]}`,
              shop_name: user["PARTY NAME"],
              pan_vat_number: user["VAT NO"],
            };
          else
            return {
              full_name: user["PARTY NAME"],
              phone: `+977-${user["MOBILE NO"]}`,
              shop_name: user["PARTY NAME"],
            };
        })()
      );
    })
  );
};

export const getAdminUsers = async (groupIds, page, pageSize, search, sort) => {
  const res = await axios.get(
    `/api/profile/admin/user-list/?group_ids=${groupIds}&page=${page}&size=${
      pageSize || 20
    }&search=${search || ""}&sort=${sort || []}`
  );

  return res.data.data;
};
