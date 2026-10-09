import React from 'react';

export function Input({ label, error, helperText, id, variant, ...rest }) {
  const fieldClass = [
    'field',
    variant === 'headline' ? 'field-headline' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={fieldClass}>
      {label && <label htmlFor={id}>{label}</label>}
      <input id={id} {...rest} />
      {(helperText || error) && (
        <div className={error ? 'field-help is-error' : 'field-help'}>
          {error || helperText}
        </div>
      )}
    </div>
  );
}
