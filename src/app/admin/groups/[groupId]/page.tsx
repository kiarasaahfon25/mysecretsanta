'use client';

import { useEffect, useState } from "react";
import { use } from 'react';


/* 
   Classes
 */
const container = "max-w-4xl mx-auto p-6";
const card = "bg-white rounded-xl shadow p-6";
const title = "text-2xl font-bold mb-6 text-black";

const row = "flex justify-between items-center border-b py-3 text-black";
const name = "font-medium";
const green = "text-green-600 font-semibold";
const red = "text-red-600 font-semibold";

const linkClass = "text-sm text-blue-600 break-all";
const button =
  "mt-6 w-full bg-black text-white py-2 rounded disabled:opacity-50";

/* 
   Page
 */
export default function ParticipantsPage({ params }: { params: Promise<{ groupId: string }> }) {
  const [data, setData] = useState<any>(null);
  const { groupId } = use(params); 

  useEffect(() => {
    fetch(`/api/groups/${groupId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((json) => { console.log("API RESPONSE:", json); 
        setData(json); });
  }, []);
   
   // Route when draw is started 
   const startDraw = async () => {
    const res = await fetch(`/api/groups/${groupId}/draw`, {
      method: "POST",
    });
  
    const json = await res.json();
    console.log("DRAW RESPONSE:", json);
  
    if (!res.ok) {
      alert(json.error || "Draw failed");
      return;
    }
  
    // Re-fetch updated group data
    fetch(`/api/groups/${groupId}`)
      .then((res) => res.json())
      .then((json) => setData(json));
  };
  
    
  if (!data) return <p className={container}>Loading...</p>;

  const allSubmitted = data.participants.every(
    (p: any) => p.wishlistSubmitted
  );

  return (
    <div className={container}>
      <div className={card}>
        <h1 className={title}>Participants</h1>

        {data.participants.map((p: any) => (
          <div key={p.id} className={row}>
            <div>
              <p className={name}>{p.name}</p>
              <p className={linkClass}>{p.inviteUrl}</p>
            </div>
            <span className={p.wishlistSubmitted ? green : red}>
              {p.wishlistSubmitted ? "Submitted" : "Pending"}
            </span>
          </div>
        ))}

        <button
          disabled={!allSubmitted}
          className={button}
          onClick={startDraw}
        >
          Start Draw
        </button>
      </div>
    </div>
  );
}
