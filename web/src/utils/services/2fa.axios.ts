import { API_URL } from '../constants';
import { api } from './axios.config';




export const GenerateQRCode = async () => {
    const response = await api.get(`${API_URL}/2fa/generate`);
    return response.data;
}

export const Activate2FA = async (code: string) => {
    const response = await api.post(`${API_URL}/2fa/activate`, {
        code_2fa: code,
    }, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
}

export const Verify2FA = async (code: string) => {
    const response = await api.post(`${API_URL}/2fa/verify`, {
        code_2fa: code
    }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
    });
    return response.data;
}

export const is2faOn = async () => {
    const response = await api.get(`${API_URL}/2fa/isActive`);
    return response.data;
}

export const disable2fa = async () => {
    const response = await api.post(`${API_URL}/2fa/disable`);
    return response.data;
}