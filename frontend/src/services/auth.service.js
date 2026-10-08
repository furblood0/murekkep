import axios from 'axios';
import { API_URL } from '../config';

class AuthService {
    async register(username, email, password) {
        try {
            const response = await axios.post(API_URL + 'register', {
                username,
                email,
                password,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'Kayıt başarısız oldu.';
        }
    }

    async login(email, password) {
        try {
            const response = await axios.post(API_URL + 'login', {
                email,
                password,
            });

            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'Giriş başarısız oldu.';
        }
    }

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

    getCurrentUser() {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (user && token) {
            return { ...JSON.parse(user), token };
        }
        return null;
    }

    async getUserProfileAndPosts() {
        const user = this.getCurrentUser();
        if (!user || !user.token) {
            throw new Error('Giriş yapmalısınız.');
        }

        try {
            const response = await axios.get(
                API_URL + `users/${user.id}/profile`,
                {
                    headers: {
                        'x-auth-token': user.token,
                    },
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'Profil bilgileri yüklenemedi.';
        }
    }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;