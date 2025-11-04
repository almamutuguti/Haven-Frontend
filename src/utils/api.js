const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function to get the authentication token from localStorage
const getAuthToken = () => {
  // Get token from the specific key used by your auth context
  const token = localStorage.getItem('haven_access_token');
  
  if (token) {
    console.log('Found token: haven_access_token');
    return token;
  }
  
  console.log('No authentication token found in localStorage');
  console.log('Available localStorage keys:', Object.keys(localStorage));
  return null;
};

export const apiClient = {
  async post(endpoint, data) {
    const token = getAuthToken();
    
    console.log('Making API request to:', `${API_BASE_URL}${endpoint}`);
    console.log('Auth token available:', !!token);

    const headers = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('Authorization header added with Bearer token');
    } else {
      console.warn('No authentication token found for API request');
      // Don't throw error here - let the backend handle authentication
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });

      console.log('API Response status:', response.status);

      if (response.status === 401) {
        // Token is invalid or expired
        console.log('Authentication failed with 401 status');
        // Clear tokens but don't redirect
        localStorage.removeItem('haven_access_token');
        localStorage.removeItem('haven_refresh_token');
        localStorage.removeItem('haven_user');
        throw new Error('Authentication failed. Your session may have expired.');
      }

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.log('API error response:', errorData);
        } catch (e) {
          errorData = { error: `HTTP error! status: ${response.status}` };
        }
        throw new Error(errorData.error || errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('API success response:', result);
      return result;

    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  async get(endpoint) {
    const token = getAuthToken();
    
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers
    });

    if (response.status === 401) {
      localStorage.removeItem('haven_access_token');
      localStorage.removeItem('haven_refresh_token');
      localStorage.removeItem('haven_user');
      throw new Error('Authentication failed. Your session may have expired.');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
};