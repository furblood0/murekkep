import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import HomePage from './components/HomePage';
import BlogDetailPage from './components/BlogDetailPage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import CreatePostPage from './components/CreatePostPage';
import ProfilePage from './components/ProfilePage';
import NotFoundPage from './components/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import UnauthorizedPage from './components/UnauthorizedPage';

function App() {
    const { currentUser, logout, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (loading) {
        return (
            <div className="app">
                <p className="boot frame">Sayfa hazırlanıyor.</p>
            </div>
        );
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isAuthPage =
        location.pathname.startsWith('/login') ||
        location.pathname.startsWith('/register');

    return (
        <div className="app">
            <header className="masthead">
                <div className="masthead-inner">
                    <Link to="/" className="wordmark">
                        Mürekkep
                    </Link>
                    <nav className="nav">
                        {currentUser ? (
                            <>
                                <Link to="/create-post" className="nav-link">
                                    Yaz
                                </Link>
                                <Link to="/profile" className="nav-link">
                                    Profil
                                </Link>
                                <button type="button" className="nav-button" onClick={handleLogout}>
                                    Çıkış
                                </button>
                            </>
                        ) : !isAuthPage ? (
                            <Link to="/login" className="nav-link">
                                Giriş
                            </Link>
                        ) : (
                            <Link to="/" className="nav-link">
                                Ana sayfa
                            </Link>
                        )}
                    </nav>
                </div>
            </header>

            <main className="frame">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/posts/:id" element={<BlogDetailPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/create-post"
                        element={
                            <ProtectedRoute>
                                <CreatePostPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/edit-post/:postId"
                        element={
                            <ProtectedRoute>
                                <CreatePostPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>

            <footer className="colophon">
                <div className="colophon-inner">
                    <p>2026</p>
                </div>
            </footer>
        </div>
    );
}

export default App;
