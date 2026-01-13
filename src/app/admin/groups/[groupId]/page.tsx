'use client';

import { Group } from "@/models/group";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { use } from 'react';
import { FiClipboard, FiTrash2 } from "react-icons/fi";

/* 
   Classes
 */
const container = "max-w-4xl mx-auto p-6";
const card = "bg-white rounded-xl shadow p-6";
const title = "text-2xl font-bold mb-6 text-black";

const row = "flex justify-between items-center border-b py-3 text-black";
const green = "text-green-600 font-semibold";
const red = "text-red-600 font-semibold";

const linkClass = "text-sm text-blue-600 break-all";
const button =
  "mt-6 w-full bg-black text-white py-2 rounded disabled:opacity-50";

interface Participant{ 
  _id: string; 
  name: string
}

/* 
   Page
 */
export default function ParticipantsPage({ params }: { params: Promise<{ groupId: string }> }) {
  const [group, setGroup] = useState<Group[]>([]);
  const [data, setData] = useState<any>(null);
  const { groupId } = use(params); 
  const [copied, setCopied] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [participants, setParticipants] = useState<any[]>(
    data?.participants ?? []
  );
  
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/groups/${groupId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((json) => { console.log("API RESPONSE:", json); 
        setData(json); });
  }, []);
    const addParticipant = async (name: string) => {

      const res = await fetch(`/api/groups/${groupId}/participants`, { 
        method:  "POST", 
        body: JSON.stringify({ name }), //send name to backend 
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })

      const { participant } = await res.json();
      console.log('Added participant', participant);

      if(!res.ok){ 
        alert("Failed to add participant"); 
        return; 
      }

      setData((prev: { participants: any; }) => ({
        ...prev,
        participants: [...prev.participants, participant]
      }));
    
    }
    
    const removeParticipant = async(participantId: string) => {
      if(!confirm("Are you sure you want to remove this participant?"))
        return ; 
      const res = await fetch(`/api/groups/${groupId}/participants/${participantId}`, { 
        method:  "Delete", 
        credentials: "include",
      })

      if(!res.ok){ 
        alert("Failed to remove participant"); 
        return; 
      }
      //Update so it removes participant on the page
      setData((prev: { participants: Participant[]; }) => ({
        ...prev,
        participants: prev.participants.filter(p => p._id !== participantId)
      }));
    }
  
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
        {/* Back button */}
        <button
          onClick={() => router.push("/admin")}
          className="mb-2 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition"
        >
          &lt; Back
        </button>

        <h1 className={title}>Participants</h1>
        {/* Add Participant */}
        
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Participant name"
            className="flex-1 rounded-md border text-gray-500 border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            onClick={() => addParticipant(newName)}
            disabled={!newName.trim()}
            className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Add
          </button>
       </div>

        {/* Participant List */}
        <div className="space-y-4">
          {data.participants.map((p: any) => (
            <div
              key={p._id}
              className={`${row} flex items-center justify-between`}
            >
              {/* Left */}
              <div className="flex-1 min-w-0">
                
                
                {/*Name + Status + delete button */}
                <div className="flex items-center justify-between w-full flex-nowrap">
                {/*Name + Status */}
                <div className="flex items-center gap-3 min-w-0">
                  <p className = "font-medium">{p.name}</p>
                  
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        p.wishlistSubmitted ? "bg-green-500" : "bg-yellow-400"
                    }`}
                     />
                    {p.wishlistSubmitted ? "Submitted" : "Pending"}
                  </span>

                  </div>
                  
                  {/* Delete button */}
                  <button
                    onClick={() => removeParticipant(p._id)}
                    className=" text-red-500 hover:text-red-600 transition"
                    aria-label="Delete participant"
                  >
                    Remove
                  </button>
                </div>
                  {/* Invite link row */}
                  <div className="mt-1 flex w-full">
                    <div
                      className="flex items-center w-full
                                rounded-md bg-gray-50 border border-gray-200
                                px-3 py-1"
                    >
                      <p 
                        className={`${linkClass} flex-1 overflow-x-auto whitespace-nowrap text-sm`}
                      >
                        {p.inviteUrl}
                      </p>
                      
                      
                    <div className="flex items-center gap-2 shrink-0 w-[64px] justify-end">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(p.inviteUrl);
                          setCopied(p._id);
                          setTimeout(() => setCopied(null), 1500);
                        }}
                        className="hover:opacity-70 transition"
                        aria-label="Copy invite link"
                        >
                        <FiClipboard className="text-sm" />
                      </button>
                      {/* Copied text */}
                      <span className="text-xs text-blue-500">
                        {copied === p._id ? "Copied" : ""}
                      </span>
                    </div>
                  </div>
                  </div>
                </div>
                {/*
                {/* Delete button */}
            </div>
          ))}
        </div>
  
        <button
          disabled={!allSubmitted}
          className={`${button} mt-6`}
          onClick={startDraw}
        >
          Start Draw
        </button>
      </div>
    </div>
  );  
}
