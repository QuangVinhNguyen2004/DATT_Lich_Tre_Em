import axios from 'axios';
const API = 'http://192.168.52.100:3000/api/child';

export const getChildrenByUser = async (userId) => {
  const res = await axios.get(`${API}/user/${userId}`);
  return res.data;
};

export const addChild = async (child) => {
  const res = await axios.post(`${API}`, child);
  return res.data;
};

export const updateChild = async (id, data) => {
  const res = await axios.put(`${API}/${id}`, data);
  return res.data;
};

export const deleteChild = async (id) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
};
