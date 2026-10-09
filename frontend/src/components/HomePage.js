import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import postService from '../services/post.service';
import { formatDate } from '../format';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postService.getAllPosts();
        setPosts(data);
      } catch (err) {
        setError(err.message || 'Yazılar yüklenirken bir hata oluştu.');
        console.error('Yazıları getirme hatası:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <p className="status">Hazırlanıyor.</p>;
  }

  if (error) {
    return <p className="status status-error">{error}</p>;
  }

  if (posts.length === 0) {
    return <p className="status">Henüz yazı yok.</p>;
  }

  return (
    <section className="contents">
      {posts.map((post, index) => (
        <article className="index-row" key={post.id}>
          <span className="index-no">{String(index + 1).padStart(2, '0')}</span>
          <h2>
            <Link to={`/posts/${post.id}`} className="index-title">
              {post.title}
            </Link>
          </h2>
          <p className="index-meta">
            {[post.authorUsername, formatDate(post.published_at || post.created_at)]
              .filter(Boolean)
              .join(' · ')}
          </p>
        </article>
      ))}
    </section>
  );
}

export default HomePage;
