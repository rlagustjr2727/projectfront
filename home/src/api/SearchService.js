import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/search';

const search = async (query) => {
  const response = await axios.get(`${API_BASE_URL}?query=${query}`);
  return response.data;
};

const getPopularSearchTerms = async (limit) => {
  const response = await axios.get(`${API_BASE_URL}/popular?limit=${limit}`);
  return response.data;
};

const SearchService = {
  search,
  getPopularSearchTerms,
};

export default SearchService;
