import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/notice';

const getAllNotices = async (page = 0, size = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notices:', error);
    return { content: [], totalPages: 0 }; // 에러가 발생하면 빈 데이터를 반환
  }
};

const getNoticeBySeq = (seq) => {
  return axios.get(`${API_BASE_URL}/${seq}`, { withCredentials: true });
};

const createNotice = async (notice, image) => {
  const formData = new FormData();
  formData.append('notice', new Blob([JSON.stringify(notice)], { type: 'application/json' }));
  if (image) {
    formData.append('image', image);
  }
  try {
    const response = await axios.post(API_BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating the notice:', error);
    throw error;
  }
};

const updateNotice = (seq, notice, image) => {
  const formData = new FormData();
  formData.append('notice', new Blob([JSON.stringify(notice)], { type: 'application/json' }));
  if (image) {
    formData.append('image', image);
  }
  return axios.put(`${API_BASE_URL}/${seq}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  });
};

const deleteNotice = (seq) => {
  return axios.delete(`${API_BASE_URL}/${seq}`, { withCredentials: true });
};

const incrementViews = (seq) => {
    return axios.post(`${API_BASE_URL}/increment-views/${seq}`, {});
  };

  const getNoticesByCategory = (category, page, size) => {
    return axios.get(`${API_BASE_URL}/category`, {
      params: {
        category,
        page,
        size
      },
      withCredentials: true,
    });
  };

const NoticeService = {
  getAllNotices,
  getNoticeBySeq,
  createNotice,
  updateNotice,
  deleteNotice,
  incrementViews,
  getNoticesByCategory
};

export default NoticeService;
