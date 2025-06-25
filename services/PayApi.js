// api/PayApi.js
import axios from 'axios';

const API = 'http://192.168.1.100:3000/api/pay'; 

export const getCards = async () => {
  const res = await axios.get(API);
  return res.data;
};
