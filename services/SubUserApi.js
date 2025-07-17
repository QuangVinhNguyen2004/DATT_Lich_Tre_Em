import api from './api';

export const getAllSubUsers = () => 
  api.get('/sub-users').then(res => res.data);

export const getSubUserById = (id) => 
  api.get(`/sub-users/${id}`).then(res => res.data);

export const getSubUsersByUser = (userId) => 
  api.get(`/sub-users/user/${userId}`).then(res => res.data);

export const createSubUser = (data) => 
  api.post('/sub-users', data).then(res => res.data);

export const updateSubUser = (id, data) => 
  api.put(`/sub-users/${id}`, data).then(res => res.data);

export const deleteSubUser = (id) => 
  api.delete(`/sub-users/${id}`).then(res => res.data);
