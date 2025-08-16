// src/services/api.js

const API_BASE_URL = 'http://localhost:8080/api';

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || `HTTP error! Status: ${response.status}`);
    }
    const text = await response.text();
    return text ? JSON.parse(text) : {};
};

export const api = {
    login: async (username, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        return handleResponse(response);
    },
    register: async (registrationData) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registrationData),
        });
        return handleResponse(response);
    },
    submitRequest: async (requestData) => {
        const response = await fetch(`${API_BASE_URL}/gatepass/request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });
        return handleResponse(response);
    },
    getPendingRequests: async (role, userId) => {
        const rolePath = role.toLowerCase();
        const response = await fetch(`${API_BASE_URL}/gatepass/pending/${rolePath}/${userId}`);
        return handleResponse(response);
    },
    approveRequest: async (requestId, approverRole, approverId) => {
        const url = `${API_BASE_URL}/gatepass/approve/${requestId}?role=${approverRole}&approverId=${approverId}`;
        const response = await fetch(url, {
            method: 'POST'
        });
        return handleResponse(response);
    },
    rejectRequest: async (requestId) => {
        const response = await fetch(`${API_BASE_URL}/gatepass/reject/${requestId}`, {
            method: 'POST'
        });
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
    getRequestsByStudent: async (studentId) => {
        const response = await fetch(`${API_BASE_URL}/gatepass/student/${studentId}`);
        return handleResponse(response);
    },
    getUsersByRole: async (role) => {
        const response = await fetch(`${API_BASE_URL}/users/role/${role}`);
        return handleResponse(response);
    },

    /**
     * ** NEW FUNCTION FOR SECURITY DASHBOARD **
     * Fetches all gate passes with the status 'APPROVED'.
     * @returns {Promise<Array<any>>} A list of approved gate pass requests.
     */
    getAllApprovedRequests: async () => {
        const response = await fetch(`${API_BASE_URL}/gatepass/approved`);
        return handleResponse(response);
    },

       deleteRequest: async (requestId) => {
        const response = await fetch(`${API_BASE_URL}/gatepass/delete/${requestId}`, {
            method: 'DELETE',
        });
        return handleResponse(response);
    },
    getApprovalHistory: async (role, userId) => {
        const rolePath = role.toLowerCase(); // 'tutor' or 'warden'
        const response = await fetch(`${API_BASE_URL}/gatepass/history/${rolePath}/${userId}`);
        return handleResponse(response);
    },

    /**
     * ** NEW FUNCTION FOR MODIFY BUTTON **
     * Revokes a previous approval.
     * @param {number} requestId The ID of the request to modify.
     * @param {string} role The role of the user revoking the approval.
     * @returns {Promise<any>} The updated gate pass request.
     */
    modifyApproval: async (requestId, role) => {
        const url = `${API_BASE_URL}/gatepass/modify/${requestId}?role=${role}`;
        const response = await fetch(url, {
            method: 'POST'
        });
        return handleResponse(response);
    },
};
