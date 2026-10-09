import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import postService from '../services/post.service';
import { resolveImageUrl } from '../config';
import { formatDate, readingLabel } from '../format';

function BlogDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await postService.getPostById(id);
        setPost(data);
      } catch (err) {
        setError(err.message || 'Yazı yüklenirken bir hata oluştu.');
        console.error('Yazı detayını getirme hatası:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <p className="status">Yazı hazırlanıyor.</p>;
  }

  if (error) {
    return <p className="status status-error">{error}</p>;
  }

  if (!post) {
    return <p className="status">Yazı bulunamadı.</p>;
  }

  const meta = [
    post.authorUsername || 'Bilinmeyen yazar',
    formatDate(post.published_at || post.created_at),
    readingLabel(post.reading_time),
  ].filter(Boolean);

  const publishedAt = post.published_at || post.created_at;
  const showUpdated =
    post.updated_at &&
    formatDate(post.updated_at) !== formatDate(publishedAt);

  return (
    <article className="essay">
      {post.status === 'draft' && <p className="essay-kicker">Taslak</p>}
      <h1 className="essay-title">{post.title}</h1>
      <p className="essay-meta">{meta.join(' · ')}</p>
      {post.image_url && (
        <figure className="essay-figure">
          <img src={resolveImageUrl(post.image_url)} alt="" />
        </figure>
      )}
      <div className="essay-body">{post.content}</div>
      {showUpdated && (
        <footer className="essay-updated">
          Son güncelleme: {formatDate(post.updated_at)}
        </footer>
      )}
    </article>
  );
}

export default BlogDetailPage;
