"use client";

import { useState } from "react";
import Link from "next/link";
import FormInput from "@/components/forms/registrationForm";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  
  //const pageContainer = "min-h-screen flex items-center justify-center bg-gray-50 p-4";
  const pageContainer = "min-h-screen flex items-center justify-center p-6";
  const card = "w-full max-w-md bg-white rounded-xl shadow-md p-8";
  const title = "text-2xl font-bold text-center mb-6";
  const form = "space-y-4 text-black";
  const submitButton =
    "w-full py-2 px-4 bg-[#2A2A72] text-white rounded-md hover:bg-gray-800 transition";
  const footerText = "mt-4 text-center text-sm text-gray-600";
  const linkStyle = "hover:underline font-bold text-[#2A2A72]" ;

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const res = await signIn("credentials", { 
        email, 
        password, 
        redirect: false
    }); 
  
      if (res?.error) {
        alert("Invalid email or password"); 
        return; 
      }
  
      router.push("/admin");
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
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
