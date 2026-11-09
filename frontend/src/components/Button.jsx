import React from 'react';

/**
 * Button component using the Uiverse.io btn-17 sliding diagonal sweep
 * and rolling text hover effect.
 *
 * Supports both <button> and <a> (via as="a" or href prop).
 */
export default function Button({
  as: Component,
  href,
  variant = 'primary', // 'primary' | 'ghost' | 'white'
  className = '',
  children,
  disabled = false,
  type = 'button',
  ...props
}) {
  const Element = Component || (href ? 'a' : 'button');

  const variantClasses = {
    primary: 'btn-17-primary',
    ghost: 'btn-17-ghost',
    white: '',
  };

  const vClass = variantClasses[variant] || variantClasses.primary;

  return (
    <Element
      href={href}
      disabled={disabled}
      type={Element === 'button' ? type : undefined}
      className={`btn-17 ${vClass} ${className}`}
      {...props}
    >
      <span className="text-container">
        <span className="text">{children}</span>
      </span>
    </Element>
  );
}
