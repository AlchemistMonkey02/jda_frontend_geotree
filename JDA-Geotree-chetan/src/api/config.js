// export const API_BASE_URL = 'http://localhost:50001/api';
export const API_BASE_URL = 'https://jda.geotree.io/api';

export const ENDPOINTS = {
    AUTH: {
        SEND_OTP: `${API_BASE_URL}/auth/send-otp`,
        SIGNUP: `${API_BASE_URL}/auth/signup`,
        LOGIN: `${API_BASE_URL}/auth/login`,
        LOGIN_PASSWORD: `${API_BASE_URL}/auth/login-password`,
        PROFILE: `${API_BASE_URL}/auth/profile`
    },
    PLANTATION: {
        CREATE: `${API_BASE_URL}/plantation/create`,
        HISTORY: `${API_BASE_URL}/plantation/history`
    },
    CERTIFICATE: {
        GENERATE: `${API_BASE_URL}/certificate/generate`,
        MY_CERTIFICATES: `${API_BASE_URL}/certificate/my-certificates`
    },
    DASHBOARD: {
        STATS: `${API_BASE_URL}/dashboard/stats`
    },
    EVENTS: {
        GET_ALL: `${API_BASE_URL}/events`
    }
};

// Standard headers with auth token
export const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return {
        headers: {
            'Authorization': user && user.token ? `Bearer ${user.token}` : ''
        }
    };
};

// Multipart headers with auth token
export const getMultipartHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return {
        headers: {
            'Authorization': user && user.token ? `Bearer ${user.token}` : '',
            'Content-Type': 'multipart/form-data'
        }
    };
};
