import axios from "../axios";

export const getAllNotifications = async () => {
  const res = await axios.get("/api/notification/admin/notifications/");
  return res.data.data.results;
};

export const updateNotificationGroup = async (notificationId, data) => {
  const res = await axios.put(
    `/api/notification/admin/groups/${notificationId}/`,
    data
  );
  return res.data;
};

export const createNotificationGroup = async (data) => {
  const res = await axios.post("/api/notification/admin/groups/", data);
  return res.data;
};

export const getNotificationGroups = async (page, pageSize) => {
  const res = await axios.get(
    `/api/notification/admin/groups/?page=${page || 1}&size=${pageSize || 20}`
  );
  return res.data.data;
};

export const dispatchNotification = async (notificationId) => {
  const res = await axios.post(
    `/api/notification/admin/groups/${notificationId}/dispatch/`
  );
  return res.data;
};

export const updateDispatchNotification = async (notificationId) => {
  const res = await axios.post(
    `/api/notification/admin/groups/${notificationId}/update_dispatched/`
  );
  return res.data;
};

export const deleteNotification = async (notificationId) => {
  const res = await axios.delete(
    `/api/notification/admin/groups/${notificationId}/`
  );
  return res.data;
};
