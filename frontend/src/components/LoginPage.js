import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.registrationSuccess) {
      toast.success(location.state.message);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Giriş başarılı.', { autoClose: 2000 });
      setTimeout(() => {
        navigate('/');
      }, 100);
    } catch (error) {
      console.error("LoginPage'de hata yakalandı:", error);
      toast.error(error.message || String(error) || 'Giriş başarısız oldu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sheet">
      <p className="sheet-kicker">Üyelik</p>
      <h1 className="sheet-title">Deftere dön</h1>
      <p className="sheet-note">Yazmak ve taslaklarını görmek için giriş yap.</p>

      <form onSubmit={handleSubmit}>
        <Input
          id="email"
          type="email"
          label="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          type="password"
          label="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Giriş yapılıyor...' : 'Giriş yap'}
        </Button>
      </form>

      <p className="sheet-switch">
        Hesabın yok mu?{' '}
        <Link to="/register" className="quiet-link">
          Katıl
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
