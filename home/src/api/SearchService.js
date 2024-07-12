import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/search';

const search = (keyword) => {
  return axios.get(`${API_BASE_URL}`, { params: { keyword } });
};

const SearchService = {
  search,
};

export default SearchService;