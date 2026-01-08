'use client';

import React, { useState, useEffect } from "react";

/* =======================
   Classes
======================= */
const container = "min-h-screen flex items-center justify-center p-6 bg-gray-50";
const card = "bg-white shadow rounded-xl p-6 max-w-md w-full";
const title = "text-xl font-bold mb-4 text-black";
const input = "w-full border rounded px-3 py-2 text-black mb-3";
const button = "w-full bg-black text-white py-2 rounded mt-4";
const error = "text-red-600 text-sm";

export default function WishlistClient({
  inviteToken,
  groupId,
}: {
  inviteToken: string;
  groupId: string;
}) {
  const [name, setName] = useState("");
  const [wishlist, setWishlist] = useState(["", "", ""]);
  const [errorMsg, setErrorMsg] = useState("");
 
  console.log("Client inviteToken:", inviteToken); //debug

  // Reset state when token changes
  useEffect(() => {
    setName("");
    setWishlist(["", "", ""]);
    setErrorMsg("");
  }, [inviteToken, groupId]);

  // Fetch participant
  useEffect(() => {
    if (!groupId || !inviteToken) return;

    fetch(`/api/groups/${groupId}/participants/${inviteToken}/wishlist`)
      .then((res) => res.json())
      .then((data) => setName(data?.name ?? ""))
      .catch(() => setName(""));
  }, [groupId, inviteToken]);

  const submit = async () => {
    const filled = wishlist.filter(Boolean);

    if (filled.length !== 3) {
      setErrorMsg("Please enter exactly 3 wishes");
      return;
    }

    const res = await fetch(
      `/api/groups/${groupId}/participants/${inviteToken}/wishlist`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wishlist }),
      }
    );

    if (!res.ok) {
      const data = await res.json();
      setErrorMsg(data?.error ?? "Something went wrong");
    } else {
      alert("Wishlist submitted 🎁");
    }
  };

  return (
    <div className={container}>
      <div className={card}>
        <h1 className={title}>
          {name ? `Hey ${name} 👋` : "Your Wishlist"}
        </h1>

        {wishlist.map((item, i) => (
          <input
            key={i}
            className={input}
            placeholder={`Wish ${i + 1}`}
            value={item}
            onChange={(e) => {
              const copy = [...wishlist];
              copy[i] = e.target.value;
              setWishlist(copy);
            }}
          />
        ))}

        {errorMsg && <p className={error}>{errorMsg}</p>}

        <button className={button} onClick={submit}>
          Submit Wishlist
        </button>
      </div>
    </div>
  );
}
