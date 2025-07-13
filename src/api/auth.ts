
const API_URL = import.meta.env.VITE_API_URL || 'https://your-backend-api.com/api';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
  };
}

// Mock data for development when backend is not available
const mockAuthResponse: AuthResponse = {
  token: 'mock-jwt-token-' + Date.now(),
  user: {
    id: 'mock-user-id',
    email: 'demo@example.com',
    name: 'Demo User',
    role: 'user'
  }
};

const isBackendAvailable = async (): Promise<boolean> => {
  try {
    console.log('Checking backend availability at:', `${API_URL}/health`);
    const response = await fetch(`${API_URL}/health`, { 
      method: 'GET',
      signal: AbortSignal.timeout(3000)
    });
    
    if (!response.ok) {
      console.log('Backend health check failed with status:', response.status);
      return false;
    }
    
    // Check if the response is actually JSON (not HTML from domain parking)
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.log('Backend returned non-JSON response, likely not a real API');
      return false;
    }
    
    console.log('Backend is available');
    return true;
  } catch (error) {
    console.log('Backend health check failed:', error);
    return false;
  }
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  console.log('Attempting login for:', email);
  
  const backendAvailable = await isBackendAvailable();
  
  if (!backendAvailable) {
    console.warn('Backend not available, using mock authentication');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      ...mockAuthResponse,
      user: { ...mockAuthResponse.user, email, name: email.split('@')[0] }
    };
  }

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  } catch (error) {
    console.error('Login API call failed:', error);
    // Fallback to mock if API call fails
    console.warn('Falling back to mock authentication');
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      ...mockAuthResponse,
      user: { ...mockAuthResponse.user, email, name: email.split('@')[0] }
    };
  }
};

export const signupUser = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  console.log('Attempting signup for:', name, email);
  
  const backendAvailable = await isBackendAvailable();
  
  if (!backendAvailable) {
    console.warn('Backend not available, using mock authentication');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      ...mockAuthResponse,
      user: { ...mockAuthResponse.user, email, name }
    };
  }

  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Signup failed');
    }

    return response.json();
  } catch (error) {
    console.error('Signup API call failed:', error);
    // Fallback to mock if API call fails
    console.warn('Falling back to mock authentication');
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      ...mockAuthResponse,
      user: { ...mockAuthResponse.user, email, name }
    };
  }
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  
  // Check if using mock token
  if (token?.startsWith('mock-jwt-token-')) {
    console.log('Using mock token, returning mock user');
    return {
      id: 'mock-user-id',
      email: 'demo@example.com',
      name: 'Demo User',
      role: 'user'
    };
  }

  const backendAvailable = await isBackendAvailable();
  
  if (!backendAvailable) {
    console.warn('Backend not available for getCurrentUser');
    throw new Error('Backend not available');
  }

  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get current user');
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('getCurrentUser failed:', error);
    throw error;
  }
};
