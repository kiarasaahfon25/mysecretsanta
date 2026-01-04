'use client';

import React, { useState, useEffect } from "react";

/* 
   Classes
*/
const container =
  "min-h-screen flex items-center justify-center p-6 bg-gray-50";
const card =
  "bg-white shadow rounded-xl p-6 max-w-md w-full";
const title =
  "text-xl font-bold mb-4 text-black";
const input =
  "w-full border rounded px-3 py-2 text-black mb-3";
const button =
  "w-full bg-black text-white py-2 rounded mt-4";
const error =
  "text-red-600 text-sm";

/* 
   Page
 */
export default function WishlistPage({
  params,
}: {
  params: Promise<{ inviteToken: string; groupId: string }>;
}) {
  const { inviteToken, groupId } = React.use(params);

  const [name, setName] = useState("");
  const [wishlist, setWishlist] = useState<string[]>(["", "", ""]);
  const [errorMsg, setErrorMsg] = useState("");
  const [drawStarted, setDrawStarted] = useState(false);
  const [assignedTo, setAssignedTo] = useState<{
    name: string;
    wishlist: string[];
  } | null>(null);

  // Reset state on token change
  useEffect(() => {
    setName("");
    setWishlist(["", "", ""]);
    setErrorMsg("");
  }, [inviteToken]);

  useEffect(() => {
    if (!groupId || !inviteToken) return;

    // fetch to get name
    fetch(
      `/api/groups/${groupId}/participants/${inviteToken}/wishlist`
    )
      .then((res) => res.json())
      .then((data) => {
        setName(data?.name ?? "");
        setDrawStarted(Boolean(data?.drawStarted));

        if (data?.drawStarted && data?.assignedTo) {
          setAssignedTo(data.assignedTo);
        }
      })
      .catch(() => {
        setName("");
      });
  }, [groupId, inviteToken]);

  /* 
     Submit wishlist
  */
  const submit = async () => {
    const filled = wishlist.filter(Boolean);

    if (filled.length !== 3) {
      setErrorMsg("Please enter exactly 3 wishes");
      return;
    }

    setErrorMsg("");

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

  /*
     Render
  */
  return (
    <div key={inviteToken} className={container}>
      <div className={card}>
        <h1 className={title}>
          {name ? `Hey ${name} 👋` : "Your Wishlist"}
        </h1>

        {/* Draw results */}
        {drawStarted && assignedTo ? (
          <>
            <p className="text-black mb-4">
              You are buying a gift for:
            </p>

            <p className="text-lg text-black font-bold mb-4">
              🎁 {assignedTo.name}
            </p>

            <div className="border rounded p-4 bg-gray-100">
              <p className="text-black font-semibold mb-2">
                Their Wishlist:
              </p>
              <ul className="list-disc list-inside text-black">
                {assignedTo.wishlist.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
