// api.ts

// Existing interfaces
interface User {
  id: number;
  username: string;
}

interface ApiError {
  error: string;
}

interface AddUserResponse {
  success: boolean;
  id: number;
  message: string;
}

interface RemoveUserResponse {
  success: boolean;
  message: string;
}

interface CheckIdResponse {
  exists: boolean;
  username?: string;
}

interface IncrementResponse {
  success: boolean;
  message: string;
  newValue: number;
}

// New Arduino interfaces
interface ArduinoStatusResponse {
  connected: boolean;
  message: string;
}

interface ArduinoSendResponse {
  success: boolean;
  message: string;
}

const API_BASE_URL = 'http://localhost:3000/api';

// Existing functions
export async function incrementAlltime(userId: number): Promise<IncrementResponse> {
  const response = await fetch(`${API_BASE_URL}/increment-alltime/${userId}`, {
    method: 'POST'
  });
  
  if (!response.ok) {
    const errorData = await response.json() as ApiError;
    throw new Error(errorData.error || 'Failed to increment alltime');
  }
  return response.json();
}

export async function getAllUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/users`);
  if (!response.ok) {
    const errorData = await response.json() as ApiError;
    throw new Error(errorData.error || 'Failed to fetch users');
  }
  return response.json();
}

export async function checkId(id: number): Promise<CheckIdResponse> {
  const response = await fetch(`${API_BASE_URL}/check-id/${id}`);
  if (!response.ok) {
    const errorData = await response.json() as ApiError;
    throw new Error(errorData.error || 'Failed to check ID');
  }
  return response.json();
}

export async function addUser(username: string): Promise<AddUserResponse> {
  const response = await fetch(`${API_BASE_URL}/add-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username })
  });
  
  if (!response.ok) {
    const errorData = await response.json() as ApiError;
    throw new Error(errorData.error || 'Failed to add user');
  }
  return response.json();
}

export async function removeUser(id: number): Promise<RemoveUserResponse> {
  const response = await fetch(`${API_BASE_URL}/remove-user/${id}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    const errorData = await response.json() as ApiError;
    throw new Error(errorData.error || 'Failed to remove user');
  }
  return response.json();
}

// New Arduino functions
export async function sendToArduino(data: string): Promise<ArduinoSendResponse> {
  const response = await fetch(`${API_BASE_URL}/arduino/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data })
  });

  if (!response.ok) {
    const errorData = await response.json() as ApiError;
    throw new Error(errorData.error || 'Failed to send data to Arduino');
  }
  return response.json();
}

export async function getArduinoStatus(): Promise<ArduinoStatusResponse> {
  const response = await fetch(`${API_BASE_URL}/arduino/status`);
  
  if (!response.ok) {
    const errorData = await response.json() as ApiError;
    throw new Error(errorData.error || 'Failed to get Arduino status');
  }
  return response.json();
}

// Helper function to check Arduino connection before sending data
export async function sendToArduinoWithCheck(data: string): Promise<ArduinoSendResponse> {
  const status = await getArduinoStatus();
  if (!status.connected) {
    throw new Error('Arduino is not connected');
  }
  return sendToArduino(data);
}