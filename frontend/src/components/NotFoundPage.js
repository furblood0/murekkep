import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="sheet">
      <p className="sheet-kicker">404</p>
      <h1 className="sheet-title">Bu sayfa basılmamış</h1>
      <p className="sheet-note">Aradığın sayfa yok ya da taşınmış.</p>
      <Link to="/" className="quiet-link">
        Ana sayfaya dön
      </Link>
    </div>
  );
}

export default NotFoundPage;
