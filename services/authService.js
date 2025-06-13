import axios from 'axios';

const API = 'http://192.168.52.100:3000/api/auth'; // đổi thành IP server thật nếu dùng thiết bị thật

export const registerUser = async ({ name, phone, email, password }) => {
  const res = await axios.post(`${API}/register`, {
    name,
    phone,
    email,
    password,
  });
  return res.data;
};
export const loginUser = async ({ email, password }) => {
  const res = await axios.post(`${API}/login`, {
    email,
    password,
  });
  return res.data;
};
