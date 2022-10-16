import axios from "../axios";

export const getBrandAnalytics = async ({ user_id, address, date }) => {
  const res = await axios.get(
    `/api/analytics/admin/brand/?user_id=${user_id || ""}&address=${
      address || ""
    }&date=${date || "today"}`
  );
  return res.data;
};

export const getCategoryAnalytics = async ({ user_id, address, date }) => {
  const res = await axios.get(
    `/api/analytics/admin/category/?user_id=${user_id || ""}&address=${
      address || ""
    }&date=${date || "today"}`
  );
  return res.data;
};

export const getOrderAnalytics = async ({
  user_id,
  product_id,
  product_sku_id,
  brand_id,
  category_id,
  address,
  date,
}) => {
  const res = await axios.get(
    `/api/analytics/admin/order/?user_id=${user_id || ""}&product_id=${
      product_id || ""
    }&product_sku_id=${product_sku_id || ""}&brand_id=${
      brand_id || ""
    }&category_id=${category_id || ""}&address=${address || ""}&date=${
      date || "today"
    }`
  );

  return res.data;
};

export const getProductAnalytics = async ({
  user_id,
  brand_id,
  category_id,
  address,
  date,
}) => {
  const res = await axios.get(
    `/api/analytics/admin/product/?user_id=${user_id || ""}&brand_id=${
      brand_id || ""
    }&category_id=${category_id || ""}&address=${address || ""}&date=${
      date || "today"
    }`
  );

  return res.data;
};

export const getProductSkuAnalytics = async ({
  user_id,
  brand_id,
  category_id,
  address,
  date,
}) => {
  const res = await axios.get(
    `/api/analytics/admin/product-sku/?user_id=${user_id || ""}&brand_id=${
      brand_id || ""
    }&category_id=${category_id || ""}&addres${address || ""}&date=${
      date || "today"
    }`
  );

  return res.data;
};
