import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error('Şifreler eşleşmiyor.');
      setLoading(false);
      return;
    }

    try {
      await register(username, email, password);
      toast.success('Kayıt başarılı.', { autoClose: 2000 });
      setTimeout(() => {
        navigate('/login');
      }, 100);
    } catch (error) {
      console.error("RegisterPage'de hata yakalandı:", error);
      toast.error(error.message || String(error) || 'Kayıt başarısız oldu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sheet">
      <p className="sheet-kicker">Katıl</p>
      <h1 className="sheet-title">Yeni bir imza</h1>
      <p className="sheet-note">Yazılarını yayınlamak için bir hesap aç.</p>

      <form onSubmit={handleSubmit}>
        <Input
          id="username"
          label="Kullanıcı adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
        <Input
          id="confirmPassword"
          type="password"
          label="Şifreyi onayla"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Kaydediliyor...' : 'Kayıt ol'}
        </Button>
      </form>

      <p className="sheet-switch">
        Zaten hesabın var mı?{' '}
        <Link to="/login" className="quiet-link">
          Giriş yap
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;
