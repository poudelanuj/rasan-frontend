import axios from "../axios";

export const createTutorialTags = async (tags) => {
  const res = await axios.post("/api/tutorial/admin/tutorial-tags/", tags);
  return res.data;
};

export const getTutorialTags = async () => {
  const res = await axios.get("/api/tutorial/admin/tutorial-tags/");
  return res.data.data;
};

export const getPaginatedTags = async (page, pageSize) => {
  const res = await axios.get(
    `/api/tutorial/admin/tutorial-tags/?page=${page || 1}&size=${
      pageSize || 20
    }`
  );
  return res.data.data;
};

export const deleteTutorialTags = async (ids) => {
  const res = await axios.delete(`/api/tutorial/admin/tutorial-tags/${ids}/`);

  return res.data;
};

export const deleteBulkTutorialTags = async (ids) => {
  const res = await axios.post(
    "/api/tutorial/admin/tutorial-tag/bulk-action/",
    {
      ids,
      action_type: "delete",
    }
  );
  return res.data;
};

export const createTutorial = async (data) => {
  const res = await axios.post("/api/tutorial/admin/tutorials/", data);
  return res.data;
};

export const getAllTutorials = async () => {
  const res = await axios.get("/api/tutorial/admin/tutorials/");
  return res.data.data.results;
};

export const getPaginatedTutorials = async (page, pageSize) => {
  const res = await axios.get(
    `/api/tutorial/admin/tutorials/?page=${page || 1}&size=${pageSize || 20}`
  );
  return res.data.data;
};

export const deleteTutorials = async (slugs) => {
  const res = await axios.delete(`/api/tutorial/admin/tutorials/${slugs}/`);

  return res.data;
};

export const deleteBulkTutorials = async (slugs) => {
  const res = await axios.post("/api/tutorial/admin/tutorial/bulk-action/", {
    ids: slugs,
    action_type: "delete",
  });
  return res.data;
};

export const getTutorialsById = async (slug) => {
  const res = await axios.get(`/api/tutorial/admin/tutorials/${slug}/`);
  return res.data.data;
};

export const updateTutorial = async (slug, data) => {
  const res = await axios.put(`/api/tutorial/admin/tutorials/${slug}/`, data);
  return res.data;
};

export const getTagListById = async (ids = []) => {
  const res = await Promise.all(
    ids.map(
      async (id) => await axios.get(`/api/tutorial/admin/tutorial-tags/${id}/`)
    )
  );
  return res;
};

export const publishTutorial = async ({ slug, shouldPublish }) => {
  if (shouldPublish) {
    const res = await axios.post(
      `/api/tutorial/admin/tutorials/${slug}/publish/`
    );
    return res.data;
  } else {
    const res = await axios.delete(
      `/api/tutorial/admin/tutorials/${slug}/publish/`
    );
    return res.data;
  }
};
