import apiClient from './Client';

export interface LoginRequest {
    email: string;
    password?: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password?: string;
}

export interface AuthResponse {
    token: string;
    message: string;
}

export const authService = {
    login: async (data: LoginRequest) => {
        const response = await apiClient.post<AuthResponse>('/api/Auth/login', data);
        return response.data;
    },

    register: async (data: RegisterRequest) => {
        const response = await apiClient.post<AuthResponse>('/api/Auth/register', data);
        return response.data;
    }
};