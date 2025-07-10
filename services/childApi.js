// src/services/childApi.js
import api from './api';

// ✅ Lấy danh sách trẻ theo user_id
export const getChildrenByUser = async (user_id) => {
  try {
    const res = await api.get(`/child?user_id=${user_id}`);
    return res.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách trẻ:', error);
    return [];
  }
};



// ✅ Tạo hồ sơ trẻ mới
export const createChild = async (childData) => {
  try {
    const res = await api.post('/child', childData);
    return res.data;
  } catch (error) {
    console.error('Lỗi khi tạo hồ sơ trẻ:', error);
    throw error;
  }
};

// src/services/childApi.js
export const uploadImage = async (uri) => {
  const formData = new FormData();
  formData.append('image', {
    uri,
    name: 'photo.jpg',
    type: 'image/jpeg',
  });

  try {
    const res = await api.post('/upload/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.url;
  } catch (error) {
    console.error('Lỗi upload ảnh:', error);
    throw error;
  }
};


export const updateChild = async (childId, childData) => {
  try {
    const res = await api.put(`/child/${childId}`, childData);
    return res.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật hồ sơ trẻ:', error.response?.data || error.message);
    throw error;
  }
};

// ✅ Xóa hồ sơ trẻ
export const deleteChild = async (childId) => {
  try {
    const res = await api.delete(`/child/${childId}`);
    return res.data;
  } catch (error) {
    console.error('Lỗi khi xóa hồ sơ trẻ:', error);
    throw error;
  }
};

