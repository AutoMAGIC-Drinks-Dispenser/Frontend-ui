// src/components/communication/api.ts

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

const API_BASE_URL = 'http://localhost:3000/api';

export async function incrementAlltime(userId: number): Promise<IncrementResponse> {
  const response = await fetch(`http://localhost:3000/api/increment-alltime/${userId}`, {
    method: 'POST'
  });
  
  if (!response.ok) {
    const errorData = await response.json() as ApiError;
    throw new Error(errorData.error || 'Failed to increment alltime');
  }
  return response.json();
}

// Hent alle brugere
export async function getAllUsers(): Promise<User[]> {
  const response = await fetch('http://localhost:3000/api/users');
  if (!response.ok) {
    const errorData = await response.json() as ApiError;
    throw new Error(errorData.error || 'Failed to fetch users');
  }
  return response.json();
}

// Check om ID eksisterer
export async function checkId(id: number): Promise<CheckIdResponse> {
  const response = await fetch(`http://localhost:3000/api/check-id/${id}`);
  if (!response.ok) {
    const errorData = await response.json() as ApiError;
    throw new Error(errorData.error || 'Failed to check ID');
  }
  return response.json();
}

// Tilføj ny bruger
export async function addUser(username: string): Promise<AddUserResponse> {
  const response = await fetch('http://localhost:3000/api/add-user', {
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

// Fjern bruger
export async function removeUser(id: number): Promise<RemoveUserResponse> {
  const response = await fetch(`http://localhost:3000/api/remove-user/${id}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    const errorData = await response.json() as ApiError;
    throw new Error(errorData.error || 'Failed to remove user');
  }
  return response.json();
}

export const sendToArduino = async (command: string): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/arduino/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command }),
    });

    if (!response.ok) {
      throw new Error('Failed to send command to Arduino');
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};

export const getArduinoStatus = async (): Promise<{ connected: boolean }> => {
  const response = await fetch(`${API_BASE_URL}/arduino/status`);
  return response.json();
};

export const connectToArduino = async (): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/arduino/connect`, {
    method: 'POST',
  });
  return response.json();
};

export const disconnectFromArduino = async (): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/arduino/disconnect`, {
    method: 'POST',
  });
  return response.json();
};