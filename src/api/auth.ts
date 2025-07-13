
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
    const response = await fetch(`${API_URL}/health`, { 
      method: 'GET',
      signal: AbortSignal.timeout(3000)
    });
    return response.ok;
  } catch {
    return false;
  }
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
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
};

export const signupUser = async (name: string, email: string, password: string): Promise<AuthResponse> => {
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
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  
  // Check if using mock token
  if (token?.startsWith('mock-jwt-token-')) {
    return {
      id: 'mock-user-id',
      email: 'demo@example.com',
      name: 'Demo User',
      role: 'user'
    };
  }

  const backendAvailable = await isBackendAvailable();
  
  if (!backendAvailable) {
    throw new Error('Backend not available');
  }

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
};
