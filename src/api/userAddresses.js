import axios from "../axios";

export const createShippingAddress = async ({ id, data }) => {
  const res = await axios.post(`/api/profile/admin/address/${id}/`, data);
  return res.data;
};

export const getAddresses = async () => {
  const res = await axios.get("/api/profile/address-meta/");
  return res.data.data;
};

export const getAddressById = async (id) => {
  const res = await axios.get(`/api/profile/admin/address/${id}/`);
  return res.data;
};

export const getMetaCityAddress = async (id) => {
  const res = await axios.get(`/api/profile/admin/address-meta-city/${id}/`);
  return res.data;
};

export const createProvince = async (name) => {
  const res = await axios.post(
    `/api/profile/admin/address-meta-province/create/`,
    { name, is_active: true }
  );

  return res.data;
};

export const createCity = async ({ name, province }) => {
  const res = await axios.post(`/api/profile/admin/address-meta-city/create/`, {
    name,
    province,
    is_active: true,
  });

  return res.data;
};

export const createArea = async ({ name, city }) => {
  const res = await axios.post(`/api/profile/admin/address-meta-area/create/`, {
    name,
    city,
    is_active: true,
  });

  return res.data;
};

export const deleteProvince = async (id) => {
  const res = await axios.delete(
    `/api/profile/admin/address-meta-province/${id}`
  );

  return res.data;
};

export const deleteCity = async (id) => {
  const res = await axios.delete(`/api/profile/admin/address-meta-city/${id}`);

  return res.data;
};

export const deleteArea = async (id) => {
  const res = await axios.delete(`/api/profile/admin/address-meta-area/${id}`);

  return res.data;
};

export const updateProvince = async ({ id, name }) => {
  const res = await axios.put(
    `/api/profile/admin/address-meta-province/${id}`,
    { name, is_active: true }
  );

  return res.data;
};

export const updateCity = async ({ id, name, province }) => {
  const res = await axios.put(`/api/profile/admin/address-meta-city/${id}`, {
    name,
    is_active: true,
    province,
  });

  return res.data;
};

export const updateArea = async ({ id, name, city }) => {
  const res = await axios.put(`/api/profile/admin/address-meta-area/${id}`, {
    name,
    is_active: true,
    city,
  });

  return res.data;
};
