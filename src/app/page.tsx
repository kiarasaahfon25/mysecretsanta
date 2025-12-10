'use client';

import Link from "next/link";

// Tailwind class strings
const containerClass = "min-h-screen flex items-center justify-center bg-white p-4";
const cardClass = "bg-white max-w-lg p-8 text-center";
const titleClass = "text-3xl font-bold mb-4 text-black";
const textClass = "text-black mb-6";
const buttonClass = "bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition";

export default function LandingPage() {
  return (
    <div className={containerClass}>
      <div className={cardClass}>
        <h1 className={titleClass}>Welcome to Secret Santa!</h1>
        <p className={textClass}>
          Organize fun gift exchanges with friends, family, or colleagues. Add participants, create wishlists, and let the magic happen!
        </p>
        <Link href="/signup">
          <button className={buttonClass}>Get Started</button>
        </Link>
      </div>
    </div>
  );
}
