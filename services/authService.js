import axios from 'axios';

const API = 'http://192.168.52.106:3000/api/auth'; 

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
