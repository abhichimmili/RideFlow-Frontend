import axiosInstance from './axiosInstance';

export const authApi = {
  async login(credentials) {
    const response = await axiosInstance.post('/api/auth/login', credentials);

    return response.data;
  },

  async registerCustomer(payload) {
    const response = await axiosInstance.post('/api/auth/register', payload);

    return response.data;
  },

  async registerDriver(payload) {
    const response = await axiosInstance.post(
      '/api/auth/register-driver',
      payload
    );

    return response.data;
  },
};
