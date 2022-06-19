import myaxios from "../myaxios";
const homeRoute = "/api/";

// Category list
export const getCategories = async ({ currentPage }) => {
  const response = await myaxios.get(
    `${homeRoute}product/admin/categories/?page=${currentPage}`
  );
  return response;
};

export const addCategory = async ({ form_data }) => {
  const response = await myaxios.post(
    `${homeRoute}product/admin/categories/`,
    form_data
  );
  return response;
};

export const publishCategory = async ({ slug }) => {
  const response = await myaxios.post(
    `${homeRoute}product/admin/categories/publish/${slug}/`
  );
  return response;
};

export const getCategory = async ({ slug }) => {
  const response = await myaxios.get(
    `${homeRoute}product/admin/categories/${slug}/`
  );
  return response;
};

export const getCategoryEndUser = async ({ slug }) => {
  const response = await myaxios.get(`${homeRoute}product/categories/${slug}/`);
  return response;
};

export const deleteCategory = async ({ slug }) => {
  const response = await myaxios.delete(
    `${homeRoute}product/admin/categories/${slug}/`
  );
  return response;
};

export const updateCategory = async ({ slug, form_data }) => {
  const response = await myaxios.put(
    `${homeRoute}product/admin/categories/${slug}/`,
    form_data
  );
  return response;
};

export const unpublishCategory = async ({ slug }) => {
  const response = await myaxios.delete(
    `${homeRoute}product/admin/categories/publish/${slug}/`
  );
  return response;
};

// brands page
export const getBrands = async ({ currentPage }) => {
  const response = await myaxios.get(
    `${homeRoute}product/admin/brands/?page=${currentPage}`
  );
  return response;
};

export const addBrand = async ({ form_data }) => {
  const response = await myaxios.post(
    `${homeRoute}product/admin/brands/`,
    form_data
  );
  return response;
};

export const getBrandEndUser = async ({ slug }) => {
  const response = await myaxios.get(`${homeRoute}product/brands/${slug}/`);
  return response;
};

export const publishBrand = async ({ slug }) => {
  const response = await myaxios.post(
    `${homeRoute}product/admin/brands/publish/${slug}/`
  );
  return response;
};

export const getBrand = async ({ slug }) => {
  const response = await myaxios.get(
    `${homeRoute}product/admin/brands/${slug}/`
  );
  return response;
};

export const deleteBrand = async ({ slug }) => {
  const response = await myaxios.delete(
    `${homeRoute}product/admin/brands/${slug}/`
  );
  return response;
};

export const updateBrand = async ({ slug, form_data }) => {
  const response = await myaxios.put(
    `${homeRoute}product/admin/brands/${slug}/`,
    form_data
  );
  return response;
};

export const unpublishBrand = async ({ slug }) => {
  const response = await myaxios.delete(
    `${homeRoute}product/admin/brands/publish/${slug}/`
  );
  return response;
};

// product groups
export const getProductGroups = async () => {
  const response = await myaxios.get(`
    ${homeRoute}product/admin/product-groups/`);
  return response;
};

// for Product List
export const getProducts = async () => {
  const response = await myaxios.get(`${homeRoute}product/admin/products/`);
  return response;
};

// for product skus
export const getProductSKUs = async () => {
  const response = await myaxios.get(`${homeRoute}product/admin/product-skus/`);
  return response;
};

export const getProductSKU = async ({ slug }) => {
  const response = await myaxios.get(
    `${homeRoute}product/admin/product-skus/${slug}/`
  );
  return response;
};
