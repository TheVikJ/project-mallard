import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={`rounded px-4 py-3 w-full focus:outline-none ${className}`}
      {...props}
    />
  )
);
Input.displayName = "Input";

export default Input;
