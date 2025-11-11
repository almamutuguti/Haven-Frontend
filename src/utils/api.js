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

// Enhanced API client with better error handling and logging
// Enhanced API client with role-based error handling
export const apiClient = {
  async request(endpoint, options = {}) {
    const token = getAuthToken();
    
    console.log('Making API request to:', `${API_BASE_URL}${endpoint}`);
    console.log('Auth token available:', !!token);

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('Authorization header added with Bearer token');
    } else {
      console.warn('No authentication token found for API request');
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      console.log('API Response status:', response.status);

      if (response.status === 401) {
        // Token is invalid or expired
        console.log('Authentication failed with 401 status');
        localStorage.removeItem('haven_access_token');
        localStorage.removeItem('haven_refresh_token');
        localStorage.removeItem('haven_user');
        throw new Error('Authentication failed. Your session may have expired.');
      }

      if (response.status === 403) {
        // Permission denied - likely role issue
        console.log('Permission denied with 403 status');
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { detail: 'Permission denied' };
        }
        
        // Check if it's a role-based permission issue
        const userData = localStorage.getItem('haven_user');
        if (userData) {
          const user = JSON.parse(userData);
          throw new Error(`Permission denied. Your role (${user.role}) does not have access to this resource. Required role: first_aider`);
        } else {
          throw new Error('Permission denied. You do not have the required permissions to perform this action.');
        }
      }

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.log('API error response:', errorData);
        } catch (e) {
          errorData = { error: `HTTP error! status: ${response.status}` };
        }
        
        // Handle field-specific errors
        if (errorData.emergency_alert_id || errorData.first_aider) {
          const fieldErrors = [];
          if (errorData.emergency_alert_id) fieldErrors.push(`Emergency Alert: ${errorData.emergency_alert_id.join(', ')}`);
          if (errorData.first_aider) fieldErrors.push(`First Aider: ${errorData.first_aider.join(', ')}`);
          throw new Error(fieldErrors.join('; '));
        }
        
        throw new Error(errorData.error || errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('API success response:', result);
      return result;

    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  // ... rest of your methods remain the same
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async get(endpoint) {
    return this.request(endpoint, {
      method: 'GET'
    });
  },

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }
};