import axios from "../axios";

// *VideoLinks
export const postVideoLink = async (data) => {
  const res = await axios.post("/api/about/admin/videos/", data);
  return res.data;
};

export const getVideoLinks = async () => {
  const res = await axios.get("/api/about/admin/videos");
  return res.data.data.results;
};

export const getVideoLinkById = async (id) => {
  const res = await axios.get(`/api/about/admin/videos/${id}/`);
  return res.data.data;
};

export const updateVideo = async ({ id, data }) => {
  const res = await axios.put(`/api/about/admin/videos/${id}/`, data);
  return res.data;
};

export const publishVideo = async ({ id, shouldPublish }) => {
  if (shouldPublish) {
    const res = await axios.post(`/api/about/admin/videos/${id}/publish/`);
    return res.data;
  } else {
    const res = await axios.delete(`/api/about/admin/videos/${id}/publish/`);
    return res.data;
  }
};

export const deleteVideoLink = async (id) => {
  const res = await axios.delete(`/api/about/admin/videos/${id}/`);
  return res.data;
};

// *Customer Stories
export const getCustomerStories = async () => {
  const res = await axios.get("/api/about/admin/stories/");
  return res.data.data.results;
};

export const postCustomerStories = async (data) => {
  const res = await axios.post("/api/about/admin/stories/", data);
  return res.data;
};

export const deleteCustomerStories = async (id) => {
  const res = await axios.delete(`/api/about/admin/stories/${id}/`);
  return res.data;
};

export const getCustomerStoriesById = async (id) => {
  const res = await axios.get(`/api/about/admin/stories/${id}/`);
  return res.data.data;
};

export const updateCustomerStories = async ({ id, data }) => {
  const res = await axios.put(`/api/about/admin/stories/${id}/`, data);
  return res.data;
};

export const publishCustomerStories = async ({ id, shouldPublish }) => {
  if (shouldPublish) {
    const res = await axios.post(`/api/about/admin/stories/${id}/publish/`);
    return res.data;
  } else {
    const res = await axios.delete(`/api/about/admin/stories/${id}/publish/`);
    return res.data;
  }
};

// *FAQS Group
export const getFAQGroups = async () => {
  const res = await axios.get("/api/about/admin/faq-groups/");
  return res.data.data.results;
};

export const getPaginatedFAQGroups = async (page, pageSize) => {
  const res = await axios.get(
    `/api/about/admin/faq-groups/?page=${page || 1}&size=${pageSize || 20}`
  );
  return res.data.data;
};

export const postFAQGroups = async (data) => {
  const res = await axios.post("/api/about/admin/faq-groups/", data);
  return res.data;
};

export const getFAQGroupsById = async (id) => {
  const res = await axios.get(`/api/about/admin/faq-groups/${id}/`);
  return res.data.data;
};

export const deleteFAQGroups = async (ids = []) => {
  const res = await axios.delete(`/api/about/admin/faq-groups/${ids}/`);

  return res;
};

export const updateFAQGroups = async ({ id, data }) => {
  const res = await axios.put(`/api/about/admin/faq-groups/${id}/`, data);
  return res.data;
};

export const publishFAQGroups = async ({ id, shouldPublish }) => {
  if (shouldPublish) {
    const res = await axios.post(`/api/about/admin/faq-groups/${id}/publish/`);
    return res.data;
  } else {
    const res = await axios.delete(
      `/api/about/admin/faq-groups/${id}/publish/`
    );
    return res.data;
  }
};

// *FAQS
export const getFAQS = async () => {
  const res = await axios.get("/api/about/admin/faqs/");
  return res.data.data.results;
};

export const postFAQS = async (data) => {
  const res = await axios.post("/api/about/admin/faqs/", data);
  return res.data;
};

export const getFAQSById = async (id) => {
  const res = await axios.get(`/api/about/admin/faqs/${id}/`);
  return res.data;
};

export const updateFAQS = async ({ id, data }) => {
  const res = await axios.put(`/api/about/admin/faqs/${id}/`, data);
  return res.data;
};

export const deleteFAQS = async (ids) => {
  const res = await axios.delete(`/api/about/admin/faqs/${ids}/`);

  return res.data;
};

export const publishFAQS = async ({ id, shouldPublish }) => {
  if (shouldPublish) {
    const res = await axios.post(`/api/about/admin/faqs/${id}/publish/`);
    return res.data;
  } else {
    const res = await axios.delete(`/api/about/admin/faqs/${id}/publish/`);
    return res.data;
  }
};
