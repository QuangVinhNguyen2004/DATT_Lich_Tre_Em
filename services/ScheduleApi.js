import axios from 'axios';
const API = 'http://192.168.52.100:3000/api/activity';



export const getScheduleByChild = async (childId) => {
  const res = await axios.get(`${API}/child/${childId}`);
  return res.data;
};

export const addSchedule = async (activity) => {
  const res = await axios.post(`${API}`, activity);
  return res.data;
};

export const updateSchedule = async (id, data) => {
  const res = await axios.put(`${API}/${id}`, data);
  return res.data;
};

export const deleteSchedule = async (id) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
};
