import React from 'react';

// Simple Button component
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => (
  <button className={`rounded px-4 py-3 font-semibold ${className}`} {...props}>
    {children}
  </button>
);

export default Button;
