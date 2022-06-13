import myaxios from "../myaxios";

export const getCategories = async () => {
    const response = await myaxios.get("/api/product/admin/categories/");
    console.log(response);
    return response;
};

export const addCategory = async ({form_data}) => {
    const response = await myaxios.post(`/api/product/admin/categories/`, form_data);
    console.log(response);
    return response;
};

export const publishCategory = async ({slug}) => {
    const response = await myaxios.post(`/api/product/admin/categories/publish/${slug}/`);
    console.log(response);
    return response;
}

export const getCategory = async ({slug}) => {
    const response = await myaxios.get(`/api/product/admin/categories/${slug}/`);
    console.log(response);
    return response;
}

export const getBrands = async () => {
    const response = await myaxios.get("/api/product/admin/brands/");
    console.log(response);
    return response;
}

export const getProductGroups = async () => {
    const response = await myaxios.get("/api/product/admin/product-groups/");
    console.log(response);
    return response;
}