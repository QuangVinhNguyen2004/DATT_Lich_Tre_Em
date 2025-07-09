import api from './api'; 

export const getSchedulesByChild = async (childId) => {
  const response = await api.get('/schedules', { params: { child_id: childId } });
  return response.data;
};

export const addSchedule = async (childId, scheduleData) => {
  // scheduleData.startTime phải là ISO string hoặc Date object
  const payload = { child_id: childId, ...scheduleData };
  const response = await api.post('/schedules', payload);
  return response.data;
};

export const updateSchedule = async (scheduleId, scheduleData) => {
  const response = await api.put(`/schedules/${scheduleId}`, scheduleData);
  return response.data;
};

export const deleteSchedule = async (scheduleId) => {
  const response = await api.delete(`/schedules/${scheduleId}`);
  return response.data;
};
