import axios from 'axios';

const API = 'http://192.168.52.106:3000/api/notification';

export const getAllNotifications = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const getNotificationById = async (id) => {
  const res = await axios.get(`${API}/${id}`);
  return res.data;
};

export const addNotification = async (notification) => {
  const res = await axios.post(API, notification);
  return res.data;
};

export const deleteNotification = async (id) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
};
