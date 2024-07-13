import axios from "axios";

const API_BASE_URL = 'http://localhost:8080/api/wboard';

const getWboards = () => {
    return axios.get(API_BASE_URL);
  };
  
  const createWboard = (wboard, image) => {
    const formData = new FormData();
    formData.append('wboard', new Blob([JSON.stringify(wboard)], { type: 'application/json' }));
    if (image) {
      formData.append('image', image);
    }
    return axios.post(API_BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  const deleteWboard = (wboardName, imageName) => {
    return axios.delete(`${API_BASE_URL}/deleteProduct/${encodeURIComponent(wboardName)}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        imageName: imageName
      }
    });
  };

  const updateWboard = (wboardName, wboard, image) => {
    const formData = new FormData();
    formData.append('wboard', new Blob([JSON.stringify(wboard)], { type: 'application/json' }));
    if (image) {
      formData.append('file', image);
    }
    return axios.put(`${API_BASE_URL}/updateProduct/${encodeURIComponent(wboardName)}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  const getFilteredWboards = (filters) => {
    return axios.get(`${API_BASE_URL}/filter`, { params: filters });
  };

  const WboardService = {
    getWboards,
    createWboard,
    deleteWboard,
    updateWboard,
    getFilteredWboards
  };

  
  
  export default WboardService;