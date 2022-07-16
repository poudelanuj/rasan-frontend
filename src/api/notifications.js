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

export const getNotificationGroups = async () => {
  const res = await axios.get("/api/notification/admin/groups/");
  return res.data.data.results;
};

export const dispatchNotification = async (notificationId) => {
  const res = await axios.post(
    `/api/notification/admin/groups/${notificationId}/dispatch/`
  );
  return res.data;
};
