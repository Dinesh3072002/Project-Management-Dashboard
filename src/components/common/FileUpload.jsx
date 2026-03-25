import React, { useRef } from 'react';

export default function FileUpload({ label, value, onChange, multiple = false, accept = 'image/*' }) {
  const inputRef = useRef();

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const readers = files.map(file => new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = (ev) => resolve(ev.target.result);
      reader.readAsDataURL(file);
    }));

    Promise.all(readers).then(results => {
      if (multiple) {
        onChange(results);
      } else {
        onChange(results[0]);
      }
    });
  };

  const previews = multiple ? (value || []) : (value ? [value] : []);

  return (
    <div>
      <div className="file-upload" onClick={() => inputRef.current.click()}>
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} onChange={handleChange} />
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--text3)', marginBottom: 8 }}>
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
        </svg>
        <p><span>Click to upload</span> {label}</p>
        <p style={{ fontSize: 11, marginTop: 4, color: 'var(--text3)' }}>PNG, JPG, GIF up to 5MB</p>
      </div>
      {previews.length > 0 && (
        <div className="preview-imgs">
          {previews.map((src, i) => (
            <img key={i} src={src} alt="preview" className="preview-img" />
          ))}
        </div>
      )}
    </div>
  );
}
