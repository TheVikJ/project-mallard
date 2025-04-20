"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { users } from "@prisma/client";

import Image from "next/image";
import Input from '../../components/Input';
import Button from '../../components/Button';
import duckCreekImage from '../../../public/duckCreek.png';

// Define form input types
type FormValues = {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
};

// Main Form Component
export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const router = useRouter();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // Save the user's email and password (mocked registration)
    const user = await attemptSignup(data.firstName, data.lastName, data.username, data.password, 1);
    if (user && user.username && user.password) {
      localStorage.setItem("mallard-user", JSON.stringify({
        username: data.username,
        password: data.password,
      }));
      router.push("/login");
      alert("Profile created! Redirecting you now...");
    }
  };

  const attemptSignup = async (firstName: string, lastName: string, username: string, password: string, userType: number) => {
    try {
      const record = await axios.post<users>("/api/signup", {
        first_name: firstName,
        last_name: lastName,
        username,
        password,
        userType,
      });
      return record.data;
    }
    catch (error: any) {
      if (error.response) {
        if (error.response.status === 400)
          alert(`${error.response.data.error}. Please make corrections and try again.`);
        else if (error.response.status === 409)
          alert("Username in use. Please try another username.");
        else if (error.response.status === 500)
          alert("Server error. Please try again later.");
      }
      else if (error.request)
        alert("Request error. Please try again.");
      else
        alert("An unexpected error occurred. Please try again later.");
    }
  }

  return (
    <div className="min-h-screen bg-[#6F63FF] flex">
      {/* Left Section */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 px-12 py-16 text-white mt-16"
      >
        <h1 className="text-5xl font-bold text-center mb-4">Register</h1>
        <p className="text-sm mb-10 text-center">create your Mallard account</p>

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
            placeholder="Username"
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
