'use client';

import { useState } from "react";
import Link from "next/link";
import FormInput from "@/components/forms/registrationForm";


const pageClass = "min-h-screen flex items-center justify-center p-4";
const cardClass = "w-full max-w-md bg-white rounded-xl shadow-md p-8";
const titleClass = "text-2xl font-bold text-center mb-6";
const formClass = "space-y-4";
const buttonClass =
  "w-full py-2 px-4 bg-[#2A2A72] text-white rounded-md hover:bg-gray-800 transition";
const footerTextClass = "mt-4 text-center text-sm text-gray-600";
const linkClass = "hover:underline font-bold text-[#2A2A72]";

export default function SignupPage() {
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Signup failed");
        return;
      }
  
      // if successful, redirect to login page 
      window.location.href = "/login"; 
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong. Try again.");
    }
  };
  

  return (
    <div className={pageClass}>
      <div className={cardClass}>
        <h1 className={titleClass}>Sign Up</h1>

        <form onSubmit={handleSubmit} className={formClass}>
          <FormInput label="Name" id="name" value={name} onChange={setName} required />
          <FormInput label="Email" id="email" type="email" value={email} onChange={setEmail} required />
          <FormInput
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={setPassword}
            required
          />

          <button type="submit" className={buttonClass}>
            Sign Up
          </button>
        </form>

        <p className={footerTextClass}>
          Already have an account?{" "}
          <Link href="/login" className={linkClass}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
