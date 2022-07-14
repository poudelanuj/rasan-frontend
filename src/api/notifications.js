import axios from "../axios";

export const getAllNotifications = async () => {
  const res = await axios.get("/api/notification/admin/notifications/");
  return res.data.data.results;
};

export const updateNotification = async (notificationId, data) => {
  const res = await axios.put(
    `/api/notification/admin/notification/${notificationId}/`,
    data
  );
  return res.data;
};

export const createNotification = async (data) => {
  const res = await axios.post("/api/notification/admin/notifications/", data);
  return res.data;
};
