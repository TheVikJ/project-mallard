"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import duckCreekImage from '../../../public/duckCreek.png';

// Form field types
type SignInValues = {
  email: string;
  password: string;
};

// Input component
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

// Button component
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => (
  <button className={`rounded px-4 py-3 font-semibold ${className}`} {...props}>
    {children}
  </button>
);

// SignInForm component
export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>();

  const onSubmit: SubmitHandler<SignInValues> = (data) => {
    console.log("Sign In:", data);
  };

  return (
    <div className="min-h-screen bg-[#7C6BFF] flex">
      {/* Left Side Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 px-12 py-16 text-white mt-32"
      >
        <h1 className="text-5xl font-bold text-center mb-4">Sign In</h1>
        <p className="text-sm mb-10 text-center">welcome back to Mallard</p>

        <div className="mb-6">
          <Input
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            })}
            className="bg-[#2D2475] text-white placeholder:text-white shadow-md"
          />
          {errors.email && (
            <p className="text-red-300 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-10">
          <Input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Minimum 6 characters",
              },
            })}
            className="bg-[#2D2475] text-white placeholder:text-white shadow-md"
          />
          {errors.password && (
            <p className="text-red-300 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="bg-gradient-to-br from-purple-700 to-purple-900 w-full py-6 text-lg shadow-lg"
        >
          Sign In
        </Button>
      </form>

       {/* Right Section */}
       <div className="hidden lg:flex flex-col items-center justify-center w-[30%] bg-white relative p-6">
        <h2 className="text-3xl font-semibold text-[#392D7C] mb-2">Mallard</h2>
        <p className="text-sm text-[#392D7C] mb-10">*get notified in an instant*</p>
        <div className="w-40 aspect-[1028/828] object-contain rounded-full absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <Image
            src={duckCreekImage}
            alt="Mallard character"
            fill
            className="aspect-auto"
          />
        </div>
      </div>
    </div>
  );
}
