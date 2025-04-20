"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import axios from "axios";
import { users } from "@prisma/client";

import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import duckCreekImage from '../../../public/duckCreek.png';
import Link from "next/link";

// Types for form input
type SignInFormInputs = {
  username: string;
  password: string;
};

// Input component
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { className?: string }
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={`rounded px-4 py-3 w-full focus:outline-none ${className}`}
    {...props}
  />
));

Input.displayName = "Input";

// Button component
const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }
> = ({ children, className, ...props }) => (
  <button className={`rounded px-4 py-3 font-semibold ${className}`} {...props}>
    {children}
  </button>
);

// Sign In Form
export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormInputs>();
  const router = useRouter(); 

  useEffect(() => {
    (async () => {
      const stored = localStorage.getItem("mallard-user");
      if (!stored) return;

      const storedUser = JSON.parse(stored);
      if (storedUser && storedUser.username && storedUser.password) {
        const user = await attemptLogin(storedUser.username, storedUser.password);
        if (user) router.push("inbox");
      }
    })();
  }, [router]);

  const onSubmit: SubmitHandler<SignInFormInputs> = async (data) => {
    const user = await attemptLogin(data.username, data.password);
    if (user && user.username && user.password) {
      localStorage.setItem("mallard-user", JSON.stringify({ username: user.username, password: user.password }));
      router.push("/inbox");
    }
  };

  const attemptLogin = async (username: string, password: string) => {
    try {
      const record = await axios.post<users>("/api/login", {
        username: username,
        password: password,
      });
      return record.data;
    }
    catch (error: any) {
      if (error.response) {
        if (error.response.status === 401)
          alert("No user found. Double-check your credentials or sign up.");
        else if (error.response.status === 500)
          alert("Server error. Please try again later.");
      }
      else if (error.request)
        alert("Request error. Please try again.");
      else
        alert("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-[#6F63FF] flex">
      {/* Left Side Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 px-12 py-16 text-white mt-16"
      >
        <h1 className="text-5xl font-bold text-center mb-4">Sign In</h1>
        <p className="text-sm mb-10 text-center">Welcome back to Mallard</p>

        <div className="mb-6">
          <Input
            placeholder="Email"
            {...register("username", {
              required: "Username is required",
            })}
            className="bg-[#392D7C] text-white placeholder:text-white shadow-md"
          />
          {errors.username && (
            <p className="text-red-300 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="mb-6">
          <Input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
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
            Sign In
        </Button>

        {/* Register Link aligned with form */}
        <div className="mt-6 text-sm text-left">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-300 underline">
            Register here
            </Link>
        </div>
        </form>
        
      {/* Right Side Graphic */}
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