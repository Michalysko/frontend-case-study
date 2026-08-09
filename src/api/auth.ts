import type {
    LoginRequest,
    LoginResponse
} from '@/types/api';

const API_URL = '/api';

export async function login(
    credentials: LoginRequest
): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    });

    if (!response.ok) {
        throw new Error(
            `Přihlášení se nezdařilo: ${response.status}`
        );
    }

    return response.json() as Promise<LoginResponse>;
}