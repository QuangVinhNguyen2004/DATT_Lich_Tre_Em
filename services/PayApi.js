import api from './api'; 

export const createPayment = async (data) => {
  const res = await api.post('/payments', data);
  return res.data;
};

export const getAllPayments = async () => {
  const res = await api.get('/payments');
  return res.data;
};
