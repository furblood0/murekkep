import React from 'react';
import { Link } from 'react-router-dom';

function UnauthorizedPage() {
  return (
    <div className="sheet">
      <p className="sheet-kicker">Erişim</p>
      <h1 className="sheet-title">Bu sayfa sana kapalı</h1>
      <p className="sheet-note">Oturumun bitmiş olabilir ya da bu yazı başka bir yazara ait.</p>
      <p className="sheet-switch">
        <Link to="/login" className="quiet-link">
          Giriş yap
        </Link>
        {' · '}
        <Link to="/" className="quiet-link">
          Ana sayfaya dön
        </Link>
      </p>
    </div>
  );
}

export default UnauthorizedPage;
