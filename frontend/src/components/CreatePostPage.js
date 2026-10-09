import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import postService from '../services/post.service';
import { toast } from 'react-toastify';
import { PostEditor } from './posts/PostEditor';

function CreatePostPage() {
    const { currentUser, loading: authLoading } = useAuth();
    const { postId } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [published, setPublished] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(Boolean(postId));
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(Boolean(postId));

    useEffect(() => {
        if (authLoading) {
            return;
        }

        if (!currentUser) {
            navigate('/login');
            return;
        }

        if (postId) {
            setIsEditing(true);
            setIsSubmitting(true);
            setError(null);

            postService.getPostById(postId)
                .then(postData => {
                    if (postData.user_id !== currentUser.id) {
                        toast.error('Bu yazıyı düzenleme yetkiniz yok.');
                        navigate('/profile');
                        return;
                    }

                    setTitle(postData.title);
                    setContent(postData.content);
                    setExcerpt(postData.excerpt || '');
                    setImageUrl(postData.image_url || '');
                    const isPublished =
                        postData.status === 'published' ||
                        postData.published === true;
                    setPublished(isPublished);
                })
                .catch(err => {
                    console.error('Yazı yüklenirken hata:', err);
                    const errorMessage = err.message || 'Yazı yüklenirken bir hata oluştu.';
                    setError(errorMessage);
                    toast.error(errorMessage);
                    if (err.message && (err.message.includes('Giriş yapmalısınız.') || err.message.includes('Yazı bulunamadı') || err.message.includes('yetkiniz yok'))) {
                        navigate('/profile');
                    }
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        }
    }, [postId, currentUser, authLoading, navigate]);

    const handleSubmit = async (payload) => {
        setIsSubmitting(true);
        setError(null);

        const { title: pTitle, content: pContent, excerpt: pExcerpt, imageUrl: pImageUrl, published: pPublished } =
            payload;

        if (!pTitle || !pContent) {
            toast.error('Başlık ve içerik alanları zorunludur.');
            setIsSubmitting(false);
            return;
        }

        try {
            if (isEditing) {
                await postService.updatePost(
                    postId,
                    pTitle,
                    pContent,
                    pExcerpt,
                    pImageUrl,
                    pPublished
                );
                toast.success('Yazı güncellendi.');
            } else {
                await postService.createPost(
                    pTitle,
                    pContent,
                    pExcerpt,
                    pImageUrl,
                    pPublished
                );
                toast.success('Yazı kaydedildi.');
            }
            navigate('/profile');
        } catch (err) {
            console.error('Yazı işlemi sırasında hata:', err);
            const errorMessage = err.message || 'Bir hata oluştu.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading || (!currentUser && !authLoading)) {
        return <p className="status">Sayfa hazırlanıyor.</p>;
    }

    if (isSubmitting && isEditing && !title) {
        return <p className="status">Yazı açılıyor.</p>;
    }

    return (
        <div className="composer">
            <p className="section-kicker">
                {isEditing ? 'Düzeltme' : 'Yeni yazı'}
            </p>
            <h1 className="page-title">
                {isEditing ? 'Yazıyı düzelt' : 'Boş sayfa'}
            </h1>
            <p className="page-note">
                Başlığı yaz, metni bırak. Hazır değilse taslak kalsın.
            </p>

            <PostEditor
                initialTitle={title}
                initialExcerpt={excerpt}
                initialImageUrl={imageUrl}
                initialContent={content}
                initialPublished={published}
                onSubmit={handleSubmit}
                submitting={isSubmitting}
                error={error}
            />
        </div>
    );
}

export default CreatePostPage;
