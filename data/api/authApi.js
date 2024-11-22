import { api } from "../axios";

export const login = async (data) => {
  try {
    const response = await api.post("/login-mobile", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (data) => {
  try {
    const response = await api.post("/register-mobile", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const isEmailExist = async (data) => {
  try {
    const response = await api.post("/is-email-exist", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateEmailForVerified = async (id, data) => {
  try {
    const response = await api.put(
      `/customers/${id}/update-email-for-verified`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAccountIsVerified = async (id) => {
  try {
    const response = await api.put(`/customers/${id}/update-account-verified`);
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

export const updateAddressCustomer = async (addressId, data) => {
  try {
    const response = await api.put(
      `/customers/${addressId}/update-address`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateResetPassword = async (userId, data) => {
  try {
    const response = await api.put(
      `/customers/${userId}/update-reset-password`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
