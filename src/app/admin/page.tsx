'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Participant } from "@/models/participant";
import { signOut } from "next-auth/react";

//Style variables

const containerClass = "p-6 max-w-5xl mx-auto";
const headerClass = "flex justify-between items-center mb-6";
const titleClass = "text-2xl font-bold";

const newGroupButtonClass =
  "px-4 py-2 bg-[#2A2A72] text-white rounded-md hover:bg-gray-800";
const emptyStateClass = "text-gray-600";
const groupListClass = "grid gap-4";
const groupCardClass =
  "block border rounded-lg p-4 hover:shadow transition ";
const groupTitleClass = "text-lg font-semibold";
const groupMetaClass = "text-sm text-gray-600";
const groupDateClass = "text-sm text-gray-500";
const logoutButtonClass = "hover:text-[#2A2A72]"; 

interface Group {
  _id: string;
  name: string;
  participants: Participant[];
  createdAt: string;
}

export default function GroupsPage() {
  /* States */
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  /* Handlers */
  const handleDelete = async (groupId: string) => { 
    if (!confirm("Are you sure you want to delete this group?")) 
      return; 

    const res = await fetch(`/api/groups/${groupId}`,{
      method:  "DELETE", 
      credentials: "include",
    });

    if(!res.ok){ 
      alert("Failed to delete group"); 
      return; 
    }
    // Where prev is previous state value
    setGroups((prev) => prev.filter ((g) => g._id !==groupId)); 

  }
  /* Effects */
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch("/api/groups", {
          credentials: "include",
        });

        if (!res.ok){ 
          console.error("Failed to fetch groups")
          //return
        }
        const data = await res.json();

        console.log("GROUPS API RESPONSE:", data); // debug

        setGroups(data.groups);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  if (loading) {
    return <p className={containerClass}>Loading groups...</p>;
  }

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className={headerClass}>
        <h1 className={titleClass}>Secret Santa Groups</h1>
       
        <div className="flex items-center gap-4">
          <Link href="/admin/groups/" className={newGroupButtonClass}>
            + New Group
          </Link>
          
          {/* Logout */}
          <button onClick={() => signOut({ callbackUrl: "/login" })}
                  className={logoutButtonClass}
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Empty state */}
      {groups.length === 0 && (
        <p className={emptyStateClass}>
          No groups yet. Create your first one.
        </p>
      )}

      {/* Groups list */}
      <div className={groupListClass}>
        {groups.map((group) => (
          <div key={group._id} className={groupCardClass}>
            <div className="flex justify-between items-center">
              <div>
                <h2 className={groupTitleClass}>{group.name } 🎁</h2>
                <p className={groupMetaClass}>
                  {group.participants.length} participants
                </p>
              </div>

              <span className={groupDateClass}>
                {new Date(group.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            {/* Actions */}
            <div className="flex justify-between items-center mt-4">
              <Link href={`/admin/groups/${group._id}`} className=" hover:underline" >
                View
              </Link>

              <button onClick={() => handleDelete(group._id)}
                className="hover:text-[#2A2A72]"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
