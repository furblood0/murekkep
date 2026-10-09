import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/auth.service';
import postService from '../services/post.service';
import { toast } from 'react-toastify';
import { Button } from './ui/Button';
import { resolveImageUrl } from '../config';
import { formatDate } from '../format';

function ProfilePage() {
    const { currentUser, loading: authLoading, logout } = useAuth();
    const [profileUser, setProfileUser] = useState(null);
    const [stats, setStats] = useState({ totalPosts: 0, publishedPosts: 0, draftPosts: 0 });
    const [userPosts, setUserPosts] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileData = async () => {
            if (authLoading) {
                setLoading(true);
                return;
            }

            if (!currentUser) {
                navigate('/login');
                return;
            }

            try {
                const data = await authService.getUserProfileAndPosts();
                setProfileUser(data.user);
                setStats({
                    totalPosts: Number(data.stats?.totalPosts || 0),
                    publishedPosts: Number(data.stats?.publishedPosts || 0),
                    draftPosts: Number(data.stats?.draftPosts || 0),
                });
                setUserPosts(data.posts || []);
            } catch (err) {
                console.error('Profil bilgisi getirme hatası:', err);
                if (err.message && (err.message.includes('Giriş yapmalısınız.') || err.message.includes('Profil bilgileri yüklenemedi.'))) {
                    toast.error('Oturumunun süresi dolmuş. Tekrar giriş yap.');
                    logout();
                    navigate('/login');
                } else {
                    setError(err.message || 'Profil bilgileri yüklenirken bir hata oluştu.');
                    toast.error('Profil yüklenemedi.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [currentUser, authLoading, navigate, logout]);

    const handleDeletePost = async (postId) => {
        if (!window.confirm('Bu yazıyı silmek istediğinden emin misin?')) {
            return;
        }

        try {
            await postService.deletePost(postId);
            toast.success('Yazı silindi.');
            const removed = userPosts.find((post) => post.id === postId);
            setUserPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
            if (removed) {
                setStats((prev) => ({
                    totalPosts: Math.max(0, prev.totalPosts - 1),
                    publishedPosts: Math.max(0, prev.publishedPosts - (removed.status === 'published' ? 1 : 0)),
                    draftPosts: Math.max(0, prev.draftPosts - (removed.status === 'draft' ? 1 : 0)),
                }));
            }
        } catch (err) {
            console.error('Yazı silinirken hata oluştu:', err);
            toast.error(err.message || 'Yazı silinemedi.');
            if (err.message && (err.message.includes('Giriş yapmalısınız.') || err.message.includes('Yazı silme başarısız oldu.'))) {
                logout();
                navigate('/login');
            }
        }
    };

    if (loading || authLoading) {
        return <p className="status">Profil hazırlanıyor.</p>;
    }

    if (error) {
        return <p className="status status-error">{error}</p>;
    }

    if (!profileUser) {
        return <p className="status">Profil bulunamadı.</p>;
    }

    const filteredPosts = userPosts.filter((post) => {
        if (filter === 'published') return post.status === 'published';
        if (filter === 'draft') return post.status === 'draft';
        return true;
    });

    const displayName = profileUser.display_name || profileUser.username;
    const initials = (displayName || '?')
        .split(' ')
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="profile">
            <aside className="byline">
                <p className="section-kicker">Yazar</p>
                <div className="avatar">
                    {profileUser.avatar_url ? (
                        <img src={resolveImageUrl(profileUser.avatar_url)} alt="" />
                    ) : (
                        <span>{initials}</span>
                    )}
                </div>
                <h1 className="byline-name">{displayName}</h1>
                <p className="byline-handle">@{profileUser.username}</p>
                <p className="byline-bio">
                    {profileUser.bio || 'Kısa bir tanıtım henüz yok.'}
                </p>

                <div className="stats">
                    <div className="stat">
                        <span className="stat-num">{stats.totalPosts}</span>
                        <span className="stat-label">Yazı</span>
                    </div>
                    <div className="stat">
                        <span className="stat-num">{stats.publishedPosts}</span>
                        <span className="stat-label">Yayında</span>
                    </div>
                    <div className="stat">
                        <span className="stat-num">{stats.draftPosts}</span>
                        <span className="stat-label">Taslak</span>
                    </div>
                </div>

                <Button variant="secondary" onClick={() => navigate('/create-post')}>
                    Yeni yazı
                </Button>
            </aside>

            <section>
                <div className="desk-head">
                    <h2>Yazdıklarım</h2>
                    <div className="filters">
                        {[
                            { id: 'all', label: 'Tümü' },
                            { id: 'published', label: 'Yayında' },
                            { id: 'draft', label: 'Taslak' },
                        ].map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                className={filter === item.id ? 'filter is-active' : 'filter'}
                                onClick={() => setFilter(item.id)}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                {userPosts.length === 0 ? (
                    <p className="status">Henüz bir yazın yok.</p>
                ) : filteredPosts.length === 0 ? (
                    <p className="status">Bu rafta yazı yok.</p>
                ) : (
                    <div className="piece-list">
                        {filteredPosts.map((post) => (
                            <article className="piece" key={post.id}>
                                <div>
                                    <h3>
                                        <Link to={`/posts/${post.id}`} className="piece-title">
                                            {post.title}
                                        </Link>
                                    </h3>
                                    <p className="piece-meta">
                                        <span className={post.status === 'published' ? 'mark' : ''}>
                                            {post.status === 'published' ? 'Yayında' : 'Taslak'}
                                        </span>
                                        {' · '}
                                        {formatDate(post.created_at)}
                                    </p>
                                </div>
                                <div className="piece-side">
                                    <div className="piece-actions">
                                        <button
                                            type="button"
                                            className="text-button"
                                            onClick={() => navigate(`/edit-post/${post.id}`)}
                                        >
                                            Düzelt
                                        </button>
                                        <button
                                            type="button"
                                            className="text-button text-button-danger"
                                            onClick={() => handleDeletePost(post.id)}
                                        >
                                            Sil
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default ProfilePage;
