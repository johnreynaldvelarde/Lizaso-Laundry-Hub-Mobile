import { api } from "../axios";

export const register = async (data) => {
  try {
    const response = await api.post("/register-mobile", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (data) => {
  try {
    const response = await api.post("/login-mobile", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (userId, data) => {
  try {
    const response = await api.put(`/customers/${userId}/update-profile`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
