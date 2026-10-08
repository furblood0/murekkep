import axios from 'axios';
import authService from './auth.service';
import { API_URL } from '../config';

class PostService {
    async createPost(title, content, excerpt, imageUrl, published) {
        const user = authService.getCurrentUser();
        if (!user || !user.token) {
            throw new Error('Giriş yapmalısınız.');
        }

        try {
            const response = await axios.post(
                API_URL + 'posts',
                { title, content, excerpt, imageUrl, published },
                {
                    headers: {
                        'x-auth-token': user.token,
                    },
                }
            );
            return response.data;
        } catch (error) {
            // Backend'den gelen hata mesajını daha iyi yakalamak için
            throw error.response?.data?.message || error.message || 'Yazı oluşturma başarısız oldu.';
        }
    }

    async getAllPosts() {
        try {
            const response = await axios.get(API_URL + 'posts');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'Yazılar yüklenemedi.';
        }
    }

    async getPostById(id) {
        const user = authService.getCurrentUser();
        const headers = user && user.token ? { 'x-auth-token': user.token } : {};

        try {
            const response = await axios.get(API_URL + `posts/${id}`, { headers });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'Yazı bulunamadı veya yüklenemedi.';
        }
    }

    async updatePost(id, title, content, excerpt, imageUrl, published) {
        const user = authService.getCurrentUser();
        if (!user || !user.token) {
            throw new Error('Giriş yapmalısınız.');
        }

        try {
            const response = await axios.put(
                API_URL + `posts/${id}`,
                { title, content, excerpt, imageUrl, published },
                {
                    headers: {
                        'x-auth-token': user.token,
                    },
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'Yazı güncelleme başarısız oldu.';
        }
    }

    async deletePost(id) {
        const user = authService.getCurrentUser();
        if (!user || !user.token) {
            throw new Error('Giriş yapmalısınız.');
        }

        try {
            const response = await axios.delete(
                API_URL + `posts/${id}`,
                {
                    headers: {
                        'x-auth-token': user.token,
                    },
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'Yazı silme başarısız oldu.';
        }
    }

    async uploadImage(file) {
        const user = authService.getCurrentUser();
        if (!user || !user.token) {
            throw new Error('Giriş yapmalısınız.');
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post(API_URL + 'uploads/image', formData, {
                headers: {
                    'x-auth-token': user.token,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data; // { url }
        } catch (error) {
            throw error.response?.data?.message || error.message || 'Görsel yüklenemedi.';
        }
    }
}

const postServiceInstance = new PostService();
export default postServiceInstance;