import React from 'react';

export function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...rest
}) {
  const variantClass =
    variant === 'secondary'
      ? 'btn-secondary'
      : variant === 'ghost'
        ? 'btn-ghost'
        : variant === 'danger'
          ? 'btn-danger'
          : '';

  return (
    <button
      className={['btn', variantClass, fullWidth ? 'btn-block' : '', className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
}
