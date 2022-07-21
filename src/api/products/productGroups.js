import axios from "../../axios";

export const getAllProductGroups = async () => {
  const res = await axios.get("/api/product/admin/product-groups/");
  return res.data.data.results;
};

export const publishProductGroup = async ({ slug, shouldPublish }) => {
  if (shouldPublish) {
    const res = await axios.post(
      `/api/product/admin/product-groups/publish/${slug}/`
    );
    return res.data;
  } else {
    const res = await axios.delete(
      `/api/product/admin/product-groups/publish/${slug}/`
    );
    return res.data;
  }
};
