import api from './api';

export const getCards = async () => {
  const res = await axios.get(API);
  return res.data;
};
