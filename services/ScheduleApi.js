import axios from 'axios';
const API_URL = 'http://192.168.52.106:3000/schedule';

export const getSchedulesByChild = async (childId, token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.filter(item => item.child._id === childId); 
};

export const addSchedule = async (childId, schedule, token) => {
  const res = await axios.post(API_URL, { ...schedule, child: childId }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateSchedule = async (scheduleId, schedule, token) => {
  const res = await axios.put(`${API_URL}/${scheduleId}`, schedule, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteSchedule = async (scheduleId, token) => {
  const res = await axios.delete(`${API_URL}/${scheduleId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
