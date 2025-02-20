import axios from 'axios';

const API_BASE_URL = 'http://localhost:8003/api';

// Create axios instance with better error handling
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // Add timeout
    timeout: 5000,
});

// Helper function to check server availability
const checkServerAvailability = async () => {
    try {
        // Using users endpoint instead of health-check since it exists
        await axios.get(`${API_BASE_URL}/users`, { 
            timeout: 2000,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        return true;
    } catch (error) {
        console.error('Server availability check failed:', error.message);
        // Don't throw error for 401/403 responses as they indicate server is running
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            return true;
        }
        return false;
    }
};

// Add a function to get the stored token
const getStoredToken = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return null;
    
    // Log token for debugging
    console.log('Retrieved token:', token);
    return token;
};

// Update the request interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('adminToken');
        
        console.log('Making request:', {
            url: config.url,
            hasToken: !!token
        });

        if (token) {
            // Make sure we're using the token with Bearer prefix
            config.headers['Authorization'] = token;
            console.log('Using token:', token.substring(0, 20) + '...');
        }

        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Update the response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.log('Unauthorized access, clearing token');
            localStorage.removeItem('adminToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Add a new function to check authentication status
export const checkAuthStatus = () => {
    const token = getStoredToken();
    return !!token;
};

// Admin related API calls
export const adminAPI = {
    login: async (credentials) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/admin/login`, credentials);
            
            if (response.data && response.data.token) {
                // Return clean token without Bearer prefix
                return {
                    token: response.data.token.replace(/^Bearer\s+/i, '').trim(),
                    ...response.data
                };
            }
            
            throw new Error('Invalid response format');
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    logout: () => {
        localStorage.removeItem('adminToken');
        delete axiosInstance.defaults.headers['Authorization'];
        window.location.href = '/login';
    },
    verifyToken: async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            throw new Error('No token found');
        }
        return axiosInstance.get('/admin/verify-token');
    }
};

// User related API calls - simplified without token
export const userAPI = {
    getAllUsers: async () => {
        try {
            const response = await axiosInstance.get('/users');
            console.log('Users API Response:', response);
            return response.data;
        } catch (error) {
            console.error('Get all users error:', error);
            throw error;
        }
    }
};

// Simplified Dashboard API without authentication
export const dashboardAPI = axios.create({
    baseURL: 'http://localhost:8003',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add interceptor to add token to dashboard requests
dashboardAPI.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        console.log('Making request to:', config.url); // Add this for debugging
        return config;
    },
    (error) => Promise.reject(error)
);

// Add payment-related API functions
export const paymentAPI = {
    getAllPayments: async () => {
        try {
            const response = await axiosInstance.get('/orders');
            return response;
        } catch (error) {
            console.error('getAllPayments error:', error);
            throw error;
        }
    },
    getSuccessfulPayments: async () => {
        try {
            const response = await axiosInstance.get('/orders?status=successful');
            return response;
        } catch (error) {
            console.error('getSuccessfulPayments error:', error);
            throw error;
        }
    },
    getCancelledPayments: async () => {
        try {
            const response = await axiosInstance.get('/orders?status=cancelled');
            return response;
        } catch (error) {
            console.error('getCancelledPayments error:', error);
            throw error;
        }
    },
    getPaymentsByStatus: (status) => axiosInstance.get(`/orders?status=${status}`)
};

// Export other APIs if needed
export default axiosInstance; 