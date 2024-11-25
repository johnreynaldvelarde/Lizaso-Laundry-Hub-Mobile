import { api } from "../axios";

// ALL API
export const updateMessageisRead = async (user_one_id, user_two_id) => {
  try {
    const response = await api.put(
      `/mobile-customer-staff/${user_one_id}/${user_two_id}/put-update-message`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// CUSTOMER SECTION API REQUEST
export const updateCustomerDetails = async (userId, data) => {
  try {
    const response = await api.put(
      `/customers/${userId}/update-customer-details`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateByCustomerCancelRequest = async (id) => {
  try {
    const response = await api.put(`/customers/${id}/update-request-cancel`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateClearAllNotificationsByCustomer = async (id) => {
  try {
    const response = await api.put(`/customers/${id}/clear-all-notifications`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateClearAllNotificationsByStaff = async (id) => {
  try {
    const response = await api.put(`/staff/${id}/clear-all-notifications`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateClearOneByOneNotificationsByCustomer = async (id) => {
  try {
    const response = await api.put(
      `/customers/${id}/clear-one-by-on-notifications`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateClearOneByOneNotificationsByStaff = async (id) => {
  try {
    const response = await api.put(
      `/staff/${id}/clear-one-by-on-notifications`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// STAFF SECTION API REQUEST
// For pending cancel request
export const updateServiceRequestCancel = async (requestId, data) => {
  try {
    const response = await api.put(
      `/staff/${requestId}/update-request-cancel`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// For pending get laundry change the request status to ongoing pickup
export const updateServiceRequestGetLaundry = async (requestId, data) => {
  try {
    const response = await api.put(
      `/staff/${requestId}/update-request-ongoing`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// For ongoing service request back to pending pickup
export const updateServiceRequestBackToPending = async (requestId, data) => {
  try {
    const response = await api.put(
      `/staff/${requestId}/update-request-back-pending`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// For ongoing pickup to finish picup
export const updateServiceRequestFinishiPickup = async (requestId) => {
  try {
    const response = await api.put(
      `/staff/${requestId}/update-request-finish-pickup`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// For ready delivery and ongoing delivery
export const updateServiceRequestReadyDelivery = async (requestId) => {
  try {
    const response = await api.put(
      `/staff/${requestId}/update-request-proceed-delivery`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateServiceRequestOngoingDelivery = async (requestId) => {
  try {
    const response = await api.put(
      `/staff/${requestId}/update-request-finish-delivery`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// For ongoing request it use QR CODE
export const updateServiceRequestUsingQRCode = async (code, id) => {
  try {
    const match = code.match(/SR-(\d+)-(.+)/);
    const serviceRequestId = match ? match[1] : null;
    const qrData = match ? match[2] : null;

    if (!serviceRequestId || !qrData) {
      throw new Error("Invalid QR code format");
    }

    const response = await api.put(
      `/staff/${serviceRequestId}/update-request-qr-code`,
      { code: qrData, user_id: id }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateStaffDetails = async (userId, data) => {
  try {
    const response = await api.put(
      `/staff/${userId}/update-staff-details`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// UPDATE NOTIFICATIONS
