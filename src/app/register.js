"use client";

import React from "react";
import { useForm } from "react-hook-form";

// Simple Input component
const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={`rounded px-4 py-3 w-full focus:outline-none ${className}`}
    {...props}
  />
));

Input.displayName = "Input";

export { Input };
// Simple Button component
const Button = ({ children, className, ...props }) => (
  <button
    className={`rounded px-4 py-3 font-semibold ${className}`}
    {...props}
  >
    {children}
  </button>
);

// Main Form Component
export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="min-h-screen bg-[#6F63FF] flex">
      {/* Left Section */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 px-12 py-16 text-white mt-16"
      >
        {/* Register Title */}
        <h1 className="text-5xl font-bold text-center mb-4">Register</h1> {/* Bigger, centered title */} 
        <p className="text-sm mb-10 text-center">create your Mallard account</p> {/* Centered subtitle */}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <Input
              placeholder="First Name"
              {...register("firstName", { required: "First name is required" })}
              className="bg-[#392D7C] text-white placeholder:text-white shadow-md"
            />
            {errors.firstName && (
              <p className="text-red-300 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <Input
              placeholder="Last Name"
              {...register("lastName", { required: "Last name is required" })}
              className="bg-[#392D7C] text-white placeholder:text-white shadow-md"
            />
            {errors.lastName && (
              <p className="text-red-300 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

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
            className="bg-[#392D7C] text-white placeholder:text-white shadow-md"
          />
          {errors.email && (
            <p className="text-red-300 text-sm mt-1">
              {errors.email.message}
            </p>
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
                message: "Password must be at least 6 characters",
              },
            })}
            className="bg-[#392D7C] text-white placeholder:text-white shadow-md"
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
          Sign Up
        </Button>
      </form>

      {/* Right Section */}
      <div className="hidden lg:flex flex-col items-center justify-center w-[30%] bg-white relative p-6">
        <h2 className="text-3xl font-semibold text-[#392D7C] mb-2">Mallard</h2>
        <p className="text-sm text-[#392D7C] mb-10">*get notified in an instant*</p>
        <img
          src="/duckCreek.png"
          alt="Mallard character"
          className="w-40 h-40 object-contain rounded-full absolute bottom-4 left-1/2 transform -translate-x-1/2"
        />
      </div>
    </div>
  );
}
