// api/PostApi.js
import axios from 'axios';

const API = 'http://192.168.1.100:3000/api/post';

// Lấy tất cả bài viết
export const getPosts = async () => {
  const res = await axios.get(API);
  return res.data;
};

// Thêm bài viết mới
export const addPost = async (post) => {
  const res = await axios.post(API, post);
  return res.data;
};
