import api from './api'; // api = axios instance có baseURL

// Upload ảnh (multipart/form-data)
export const uploadImageApi = async (formData) => {
  try {
    const res = await api.post('/upload/upload-image/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data; // { url: string }
  } catch (error) {
    console.error('Lỗi upload ảnh:', error);
    throw error;
  }
};

// Cập nhật thông tin user theo userId
export const updateUserApi = async (userId, data) => {
  try {
    const res = await api.put(`/users/${userId}`, data);
    return res.data; // user object mới
  } catch (error) {
    console.error('Lỗi cập nhật user:', error);
    throw error;
  }
};
