export interface User {
    id: number;
    username: string;
    alltime: number;
  }
  
  export interface DbResponse {
    success: boolean;
    message?: string;
    error?: string;
  }