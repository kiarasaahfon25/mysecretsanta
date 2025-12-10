"use client";

import { useState } from "react";
import Link from "next/link";
import FormInput from "@/components/forms/registrationForm";

export default function LoginPage() {
  
  const pageContainer = "min-h-screen flex items-center justify-center bg-gray-50 p-4";
  const card = "w-full max-w-md bg-white rounded-xl shadow-md p-8";
  const title = "text-2xl font-bold text-black text-center mb-6";
  const form = "space-y-4";
  const submitButton =
    "w-full py-2 px-4 bg-black text-white rounded-md hover:bg-red-900 transition";
  const footerText = "mt-4 text-center text-sm text-gray-600";
  const linkStyle = "text-red-900 hover:underline";

  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Login failed");
        return;
      }
  
      // on success should redirect to admin dashboard (will implement after dashboard implementation)
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Try again.");
    }
  };
  

  
  return (
    <div className={pageContainer}>
      <div className={card}>
        <h1 className={title}>Login</h1>

        <form onSubmit={handleSubmit} className={form}>
          <FormInput
            label="Email"
            id="email"
            type="email"
            value={email}
            onChange={setEmail}
            required
          />

          <FormInput
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={setPassword}
            required
          />

          <button type="submit" className={submitButton}>
            Login
          </button>
        </form>

        <p className={footerText}>
          Don’t have an account?{" "}
          <Link href="/signup" className={linkStyle}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
