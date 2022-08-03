import axios from "../axios";

export const createTutorialTags = async (tags) => {
  const res = await axios.post("/api/tutorial/admin/tutorial-tags/", tags);
  return res.data;
};

export const getTutorialTags = async () => {
  const res = await axios.get("/api/tutorial/admin/tutorial-tags/");
  return res.data.data;
};

export const deleteTutorialTags = async (ids = []) => {
  const res = await Promise.all(
    ids.map(
      async (id) =>
        await axios.delete(`/api/tutorial/admin/tutorial-tags/${id}/`)
    )
  );

  return res;
};

export const createTutorial = async (data) => {
  const res = await axios.post("/api/tutorial/admin/tutorials/", data);
  return res.data;
};

export const getAllTutorials = async () => {
  const res = await axios.get("/api/tutorial/admin/tutorials/");
  return res.data.data.results;
};

export const deleteTutorials = async (slugs = []) => {
  const res = await Promise.all(
    slugs.map(
      async (slug) =>
        await axios.delete(`/api/tutorial/admin/tutorials/${slug}/`)
    )
  );

  return res;
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

export const publishTutorial = async ({ slug, is_published }) => {
  if (is_published) {
    const res = await axios.delete(
      `/api/tutorial/admin/tutorials/${slug}/publish/`
    );
    return res.data;
  } else {
    const res = await axios.post(
      `/api/tutorial/admin/tutorials/${slug}/publish/`
    );
    return res.data;
  }
};
