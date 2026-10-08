// src/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Yüklenme durumunu takip etmek için

  useEffect(() => {
    try {
      const stored = authService.getCurrentUser();
      if (stored?.id && stored?.token) {
        const { token, ...user } = stored;
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Kullanıcı bilgileri yüklenirken hata oluştu:', error);
      setCurrentUser(null);
      authService.logout();
    } finally {
      setLoading(false);
    }
  }, []);

  // Giriş fonksiyonu
  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password); // data = { token: ..., user: {...} }
      if (data && data.user) {
        setCurrentUser(data.user); // currentUser'ı sadece kullanıcı objesi olarak ayarla
        // authService.login zaten localStorage'a kaydediyor olmalı, burada tekrar kaydetmiyoruz.
      } else {
        // Eğer data veya data.user beklenildiği gibi değilse
        throw new Error("Giriş verileri eksik veya hatalı.");
      }
      return data; // Başarılı response'u döndür
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      // Hatanın LoginPage'e iletilmesi için fırlatılması GEREKLİ
      // Backend'den gelen spesifik hata mesajını veya genel bir mesajı fırlatıyoruz
      throw error.message || error; // error.message veya doğrudan error objesini/stringini fırlat
    } finally {
      setLoading(false);
    }
  };

  // Yeni: Kayıt fonksiyonu eklendi
  const register = async (username, email, password) => {
    setLoading(true);
    try {
      const data = await authService.register(username, email, password); // Backend'den gelen response
      // Kayıt işleminde genellikle otomatik giriş yapılmaz, sadece başarı mesajı döndürülür
      // ve kullanıcı login sayfasına yönlendirilir.
      return data; // Backend'den gelen başarı mesajını/veriyi döndür
    } catch (error) {
      console.error('Register error in AuthContext:', error);
      // Hatanın RegisterPage'e iletilmesi için fırlatılması GEREKLİ
      throw error.message || error; // error.message veya doğrudan error objesini/stringini fırlat
    } finally {
      setLoading(false);
    }
  };

  // Çıkış fonksiyonu
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    register, // register fonksiyonunu da value objesine ekledik
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};