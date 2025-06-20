import axios from 'axios';

const API = 'http://192.168.52.106:3000/api/diaries'; // Địa chỉ API của bạn

// Lấy tất cả nhật ký
export const getAllDiaries = async () => {
  const res = await axios.get(API);
  return res.data;
};

// Thêm nhật ký mới
export const addDiary = async (data) => {
  const res = await axios.post(API, data);
  return res.data;
};

// Cập nhật nhật ký
export const updateDiary = async (id, data) => {
  const res = await axios.put(`${API}/${id}`, data);
  return res.data;
};

// Xóa nhật ký
export const deleteDiary = async (id) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
};
