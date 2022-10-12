import moment from "moment";
import axios from "../axios";

export const getUsers = async (page, pageSize) => {
  const response = await axios.get(
    `/api/profile/admin/user-list/?page=${page}&size=${pageSize}`
  );
  return response.data.data;
};

export const getUser = async (user_id) => {
  const response = await axios.get(
    "/api/profile/admin/user-profile/" + user_id + "/"
  );
  return response.data.data;
};

export const updateUser = async ({ data, key }) => {
  const response = await axios.put(
    `/api/profile/admin/user-profile/` + key + "/",
    data
  );
  return response.data;
};

export const logoutUser = async (number) => {
  await axios.post(`/api/auth/logout-user/`, {
    phone: number,
  });
  return "Logged out Successfully.";
};

export const deactivateUser = async (number) => {
  const response = await axios.post(`/api/auth/deactivate-user/`, {
    phone: number,
  });
  return response.data;
};

export const getLastLogin = async (phone) => {
  const response = await axios.post(`/api/auth/auth-meta/`, { phone: phone });
  let date = new Date(response.data.data.last_login_at);
  return moment(date).format("YYYY/MM/DD");
};

export const getShopInfo = async (user_id) => {
  const response = await axios.get(
    "/api/profile/admin/shop-detail/" + user_id + "/"
  );
  return response.data.data;
};

export const updateShop = async ({ data, key }) => {
  const response = await axios.put(
    `/api/profile/admin/shop-detail/` + key + "/",
    data
  );
  return response.data;
};
export const getAllProvinces = async () => {
  const response = await axios.get("/api/profile/address-meta/");
  return response.data.data;
};

export const updateAddress = async ({ data, key }) => {
  const response = await axios.put(
    `/api/profile/admin/address/detail/` + key + "/",
    data
  );
  return response.data;
};

export const createAddress = async ({ data, key }) => {
  const response = await axios.post(
    `/api/profile/admin/address/` + key + "/",
    data
  );
  return response.data;
};
export const deleteAddress = async ({ key }) => {
  const response = await axios.delete(
    `/api/profile/admin/address/detail/` + key + "/"
  );
  return response.data;
};

export const getOtpRequests = async ({ pageSize, page, sort, phone }) => {
  const response = await axios.get(
    `/api/auth/otp-requests/?page=${page}&size=${pageSize}&sort=${sort}&phone=${phone}`
  );
  return response.data.data;
};

export const verifyUser = async ({ key }) => {
  const response = await axios.post(
    `/api/profile/admin/verify-user/` + key + "/",
    null
  );
  return response.data;
};

export const deleteUser = async ({ phone }) => {
  const response = await axios.delete(`/api/auth/delete-user/`, {
    data: {
      phone: phone,
    },
  });
  return response.data;
};

export const getEndUser = async () => {
  const response = await axios.get("/api/profile/");
  return response.data.data;
};
export const unVerifyUser = async ({ key }) => {
  const response = await axios.delete(
    `/api/profile/admin/verify-user/` + key + "/"
  );
  return response.data;
};
