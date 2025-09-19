// src/services/api.js

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * A helper function to handle API responses, parse JSON, and throw errors.
 * @param {Response} response The raw response from the fetch call.
 * @returns {Promise<any>} The parsed JSON data or plain text.
 */
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || `HTTP error! Status: ${response.status}`);
    }
    const text = await response.text();
    try {
        // Try to parse as JSON first. This works for most responses.
        return text ? JSON.parse(text) : {};
    } catch (e) {
        // If parsing fails, it's a plain text response (e.g., "Password changed successfully!").
        return text;
    }
};

export const api = {
    // --- Authentication ---
    login: async (username, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        return handleResponse(response);
    },

    // --- Student Actions ---
    submitRequest: async (requestData) => {
        const response = await fetch(`${API_BASE_URL}/gatepass/request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });
        return handleResponse(response);
    },
    getRequestsByStudent: async (studentId) => {
        const response = await fetch(`${API_BASE_URL}/gatepass/student/${studentId}`);
        return handleResponse(response);
    },
    deleteRequest: async (requestId) => {
        const response = await fetch(`${API_BASE_URL}/gatepass/request/${requestId}`, {
            method: 'DELETE',
        });
        return handleResponse(response);
    },

    // --- Tutor & Warden Actions ---
    getPendingRequests: async (role, userId) => {
        const endpoint = role === 'TUTOR' ? `/gatepass/pending/tutor/${userId}` : `/gatepass/pending/warden/${userId}`;
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        return handleResponse(response);
    },
    getApprovalHistory: async (role, userId) => {
        const endpoint = role === 'TUTOR' ? `/gatepass/history/tutor/${userId}` : `/gatepass/history/warden/${userId}`;
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        return handleResponse(response);
    },
    approveRequest: async (requestId, approverRole) => {
        const url = `${API_BASE_URL}/gatepass/approve/${requestId}?role=${approverRole}`;
        const response = await fetch(url, { method: 'POST' });
        return handleResponse(response);
    },
    rejectRequest: async (requestId) => {
        const response = await fetch(`${API_BASE_URL}/gatepass/reject/${requestId}`, { method: 'POST' });
        return handleResponse(response);
    },
    modifyApproval: async (requestId) => {
        const response = await fetch(`${API_BASE_URL}/gatepass/modify/${requestId}`, { method: 'POST' });
        return handleResponse(response);
    },
    
    // --- Security Actions ---
    getAllApprovedRequests: async () => {
        const response = await fetch(`${API_BASE_URL}/gatepass/approved`);
        return handleResponse(response);
    },
    
    // --- General User & Profile Actions ---
    getUsersByRole: async (role) => {
        const response = await fetch(`${API_BASE_URL}/users/role/${role}`);
        return handleResponse(response);
    },
    updateProfile: async (userId, profileData) => {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData)
        });
        return handleResponse(response);
    },
    changePassword: async (userId, currentPassword, newPassword) => {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/change-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentPassword, newPassword }),
        });
        return handleResponse(response);
    },
    
    // --- Admin Actions ---
    adminGetAllUsers: async () => {
        const response = await fetch(`${API_BASE_URL}/admin/users`);
        return handleResponse(response);
    },
    adminCreateUser: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/admin/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        return handleResponse(response);
    },
    adminUpdateUser: async (userId, userData) => {
        const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        return handleResponse(response);
    },
    adminDeleteUser: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
            method: 'DELETE',
        });
        return handleResponse(response);
    },
};

