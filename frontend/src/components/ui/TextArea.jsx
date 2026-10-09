import React from 'react';

export function TextArea({
  label,
  error,
  helperText,
  id,
  rows = 8,
  variant,
  ...rest
}) {
  const fieldClass = ['field', variant === 'prose' ? 'field-prose' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={fieldClass}>
      {label && <label htmlFor={id}>{label}</label>}
      <textarea id={id} rows={rows} {...rest} />
      {(helperText || error) && (
        <div className={error ? 'field-help is-error' : 'field-help'}>
          {error || helperText}
        </div>
      )}
    </div>
  );
}
