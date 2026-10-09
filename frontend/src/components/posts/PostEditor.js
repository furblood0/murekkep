import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { Button } from '../ui/Button';
import postService from '../../services/post.service';
import { resolveImageUrl } from '../../config';

export function PostEditor({
  initialTitle = '',
  initialExcerpt = '',
  initialImageUrl = '',
  initialContent = '',
  initialPublished = false,
  onSubmit,
  submitting,
  error,
}) {
  const [title, setTitle] = useState(initialTitle);
  const [excerpt, setExcerpt] = useState(initialExcerpt);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [content, setContent] = useState(initialContent);
  const [published, setPublished] = useState(initialPublished);
  const [mode, setMode] = useState('edit');
  const [imageMode, setImageMode] = useState('url');
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      excerpt,
      imageUrl,
      content,
      published,
    });
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const handleImageUpload = async () => {
    if (!imageFile) {
      setUploadError('Lütfen bir görsel dosyası seçin.');
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      const data = await postService.uploadImage(imageFile);
      if (data && data.url) {
        setImageUrl(data.url);
      }
    } catch (err) {
      setUploadError(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form className="editor" onSubmit={handleSubmit}>
      {error && <div className="notice">{error}</div>}

      <div className="editor-bar">
        <div className="filters">
          <button
            type="button"
            className={mode === 'edit' ? 'mode is-active' : 'mode'}
            onClick={() => setMode('edit')}
          >
            Düzenle
          </button>
          <button
            type="button"
            className={mode === 'preview' ? 'mode is-active' : 'mode'}
            onClick={() => setMode('preview')}
          >
            Önizleme
          </button>
        </div>
        <p className="editor-count">{wordCount} kelime</p>
      </div>

      {mode === 'edit' ? (
        <>
          <Input
            id="title"
            label="Başlık"
            variant="headline"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            id="excerpt"
            label="Özet"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            helperText="İçindekilerde görünecek kısa cümle. Boş bırakılabilir."
          />

          <div className="cover-box">
            <div className="cover-head">
              <span className="cover-label">Kapak görseli</span>
              <div className="filters">
                <button
                  type="button"
                  className={imageMode === 'url' ? 'mode is-active' : 'mode'}
                  onClick={() => setImageMode('url')}
                >
                  Adres
                </button>
                <button
                  type="button"
                  className={imageMode === 'file' ? 'mode is-active' : 'mode'}
                  onClick={() => setImageMode('file')}
                >
                  Dosya
                </button>
              </div>
            </div>

            {imageMode === 'url' ? (
              <Input
                id="imageUrl"
                label="Görsel adresi"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                helperText="Dış bir adres yapıştırabilir veya boş bırakabilirsin."
              />
            ) : (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImageFile(e.target.files ? e.target.files[0] : null)
                  }
                />
                <div className="cover-actions">
                  <span>En fazla 5 MB, yalnızca görsel.</span>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleImageUpload}
                    disabled={uploading}
                  >
                    {uploading ? 'Yükleniyor...' : 'Yükle'}
                  </Button>
                </div>
                {uploadError && <div className="field-help is-error">{String(uploadError)}</div>}
              </div>
            )}

            {imageUrl && <div className="chosen">Seçili görsel: {imageUrl}</div>}
          </div>

          <TextArea
            id="content"
            label="Metin"
            variant="prose"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <div className="check-row">
            <input
              type="checkbox"
              id="published"
              name="published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            <label htmlFor="published">Yayınla</label>
          </div>
        </>
      ) : (
        <div className="preview">
          {imageUrl && (
            <figure className="preview-figure">
              <img src={resolveImageUrl(imageUrl)} alt="" />
            </figure>
          )}
          <h1>{title || 'Başlıksız'}</h1>
          {excerpt && <p className="preview-excerpt">{excerpt}</p>}
          <div className="preview-body">{content}</div>
        </div>
      )}

      <div className="editor-actions">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </div>
    </form>
  );
}
