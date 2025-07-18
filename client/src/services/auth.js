import api from './api';

// Register a new user
export const registerUser = async (name, email, password) => {
  const res = await api.post('/auth/register', { name, email, password });
  return res.data;
};

// Login and get access token + user info
export const loginUser = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};

// Logout (clears refresh token cookie on backend)
export const logoutUser = async () => {
  await api.post('/auth/logout');
};
