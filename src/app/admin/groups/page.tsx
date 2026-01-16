'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

/* =======================
   Classname variables
======================= */

const containerClass = "max-w-3xl mx-auto p-6";
const cardClass = "bg-white rounded-xl shadow-md p-6";

const titleClass = "text-2xl font-bold mb-6";

const formClass = "space-y-6";

const fieldGroupClass = "space-y-2";
const labelClass = "block text-sm font-medium text-gray-700";
const inputClass =
  "w-full border rounded-md  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2A2A72]";

const participantRowClass = "flex gap-2 items-center";
const removeButtonClass =
  "text-sm text-red-600 hover:underline";

const addButtonClass =
  "text-sm  font-medium hover:underline";

const submitButtonClass =
  "w-full bg-[#2A2A72] text-white py-2 rounded-md hover:bg-gray-800 transition";

const errorClass = "text-red-600 text-sm";

/* =======================
   Page
======================= */

export default function NewGroupPage() {
  const router = useRouter();

  const [groupName, setGroupName] = useState("");
  const [participants, setParticipants] = useState<string[]>([
    "",
    "",
    "",
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const addParticipant = () => {
    setParticipants([...participants, ""]);
  };

  const removeParticipant = (index: number) => {
    if (participants.length <= 3) return;
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const updateParticipant = (index: number, value: string) => {
    const updated = [...participants];
    updated[index] = value;
    setParticipants(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!groupName.trim()) {
      setError("Group name is required");
      return;
    }

    const filteredParticipants = participants
      .map((p) => p.trim())
      .filter(Boolean);

    if (filteredParticipants.length < 3) {
      setError("A group must have at least 3 participants");
      return;
    }
     
    console.log("Submitting group:", {
        name: groupName,
        participants: filteredParticipants
      });

    try {
      setLoading(true);

      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: groupName,
          participants: filteredParticipants.map(p => ({ name: p })), //Need an object with a name field
        }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create group");
      }

      router.push("/admin");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={containerClass}>
      <div className={cardClass}>
        <h1 className={titleClass}>Create New Group</h1>

        <form onSubmit={handleSubmit} className={formClass}>
          {/* Group name */}
          <div className={fieldGroupClass}>
            <label className={labelClass}>Group Name</label>
            <input
              className={inputClass}
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g. Family Christmas 2025"
            />
          </div>

          {/* Participants */}
          <div className={fieldGroupClass}>
            <label className={labelClass}>Participants</label>

            {participants.map((name, index) => (
              <div key={index} className={participantRowClass}>
                <input
                  className={inputClass}
                  value={name}
                  onChange={(e) =>
                    updateParticipant(index, e.target.value)
                  }
                  placeholder={`Participant ${index + 1}`}
                />

                {participants.length > 3 && (
                  <button
                    type="button"
                    onClick={() => removeParticipant(index)}
                    className={removeButtonClass}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addParticipant}
              className={addButtonClass}
            >
              + Add another participant
            </button>
          </div>

          {/* Error */}
          {error && <p className={errorClass}>{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={submitButtonClass}
          >
            {loading ? "Creating..." : "Create Group"}
          </button>
        </form>
      </div>
    </div>
  );
}
