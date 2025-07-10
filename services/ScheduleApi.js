import api from './api'; 

export const getSchedulesByChild = async (childId) => {
  const res = await api.get(`/Schedule?child_id=${childId}`);
  return res.data;
};

export const addSchedule = (child_id, scheduleData) => {
  // Chú ý: truyền child_id vào trong body
  return api.post('/Schedule', {
    child_id,   // gửi vào body
    ...scheduleData,
  });
};

export const updateSchedule = async (scheduleId, scheduleData) => {
  const response = await api.put(`/Schedule/${scheduleId}`, scheduleData);
  return response.data;
};

export const deleteSchedule = async (scheduleId) => {
  const response = await api.delete(`/Schedule/${scheduleId}`);
  return response.data;
};
