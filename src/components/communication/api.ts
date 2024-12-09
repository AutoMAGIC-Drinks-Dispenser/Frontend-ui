// --- Interfaces ---

// User and Database-related interfaces
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

// Arduino-related interfaces
interface ArduinoStatusResponse {
  connected: boolean;
  message: string;
}

interface ArduinoSendResponse {
  success: boolean;
  message: string;
}

// Allowed commands for Arduino
type ArduinoCommand = "single" | "double";

// Base URL for API endpoints
const API_BASE_URL = "http://localhost:3000/api";

// --- Database-related functions ---

export async function incrementAlltime(userId: number): Promise<IncrementResponse> {
  const response = await fetch(`${API_BASE_URL}/increment-alltime/${userId}`, {
    method: "POST",
  });

  if (!response.ok) {
    const errorData = (await response.json()) as ApiError;
    throw new Error(errorData.error || "Failed to increment alltime");
  }
  return response.json();
}

export async function getAllUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/users`);
  if (!response.ok) {
    const errorData = (await response.json()) as ApiError;
    throw new Error(errorData.error || "Failed to fetch users");
  }
  return response.json();
}

export async function checkId(id: number): Promise<CheckIdResponse> {
  const response = await fetch(`${API_BASE_URL}/check-id/${id}`);
  if (!response.ok) {
    const errorData = (await response.json()) as ApiError;
    throw new Error(errorData.error || "Failed to check ID");
  }
  return response.json();
}

export async function addUser(username: string): Promise<AddUserResponse> {
  const response = await fetch(`${API_BASE_URL}/add-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as ApiError;
    throw new Error(errorData.error || "Failed to add user");
  }
  return response.json();
}

export async function removeUser(id: number): Promise<RemoveUserResponse> {
  const response = await fetch(`${API_BASE_URL}/remove-user/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = (await response.json()) as ApiError;
    throw new Error(errorData.error || "Failed to remove user");
  }
  return response.json();
}

// --- Arduino-related functions ---

/**
 * Get the current connection status of the Arduino.
 */
export async function getArduinoStatus(): Promise<ArduinoStatusResponse> {
  const response = await fetch(`${API_BASE_URL}/arduino/status`);
  if (!response.ok) {
    const errorData = (await response.json()) as ApiError;
    throw new Error(errorData.error || "Failed to get Arduino status");
  }
  return response.json();
}

/**
 * Send a command to the Arduino.
 */
export async function sendToArduino(command: ArduinoCommand): Promise<ArduinoSendResponse> {
  const response = await fetch(`${API_BASE_URL}/arduino/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: command }),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as ApiError;
    throw new Error(errorData.error || "Failed to send data to Arduino");
  }
  return response.json();
}

/**
 * Helper function to check the Arduino connection before sending a command.
 */
export async function sendToArduinoWithCheck(command: ArduinoCommand): Promise<ArduinoSendResponse> {
  const status = await getArduinoStatus();
  if (!status.connected) {
    throw new Error("Arduino is not connected");
  }
  return sendToArduino(command);
}

/**
 * Connect to the Arduino.
 */
export async function connectArduino(): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/arduino/connect`, { method: "POST" });
  if (!response.ok) {
    const errorData = (await response.json()) as ApiError;
    throw new Error(errorData.error || "Failed to connect to Arduino");
  }
  return response.json();
}

/**
 * Disconnect from the Arduino.
 */
export async function disconnectArduino(): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/arduino/disconnect`, { method: "POST" });
  if (!response.ok) {
    const errorData = (await response.json()) as ApiError;
    throw new Error(errorData.error || "Failed to disconnect Arduino");
  }
  return response.json();
}

// --- Combined Utility Functions ---

/**
 * Update a user in the database and notify the Arduino with a command.
 * @param userId - The user ID to update.
 * @param command - The command to send to the Arduino ("single" or "double").
 */
export async function updateUserAndNotifyArduino(
  userId: number,
  command: ArduinoCommand
): Promise<void> {
  try {
    // Increment alltime in the database
    const incrementResponse = await incrementAlltime(userId);
    console.log("Database updated:", incrementResponse);

    // Send command to Arduino
    const arduinoResponse = await sendToArduinoWithCheck(command);
    console.log("Arduino notified:", arduinoResponse);
  } catch (error) {
    console.error("Failed to update user and notify Arduino:", error);
    throw error;
  }
}
