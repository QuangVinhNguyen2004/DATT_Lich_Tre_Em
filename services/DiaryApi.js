import api from './api';

export const getAllDiariesByChild = async (child_id) => {
  const res = await api.get(`/diary/child/${child_id}`);
  return res.data;
};

export const addDiary = async (data) => {
  const res = await api.post('/diary', data);
  return res.data;
};

export const deleteDiary = async (id) => {
  const res = await api.delete(`/diary/${id}`);
  return res.data;
};
