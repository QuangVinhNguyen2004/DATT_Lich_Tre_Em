import api from './api';

// Lấy bài viết với filter params
export const getPosts = async (params = {}) => {
  const res = await api.get('/post', { params });
  return res.data;
};

// Thêm bài viết mới
export const addPost = async (post) => {
  try {
    console.log('>> Gửi bài viết:', post); // Debug
    const res = await api.post('/post', post);
    return res.data;
  } catch (err) {
    console.error('❌ Lỗi khi thêm bài viết:', err.response?.data || err.message);
    throw err;
  }
};
// Xóa bài viết theo ID và user ID
export const deletePostByUser = async (postId, userId) => {
  const res = await api.delete(`/post/${postId}`, {
    data: { userId },
  });
  return res.data;
};