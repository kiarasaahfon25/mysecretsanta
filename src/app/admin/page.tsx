'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

//Style variables

const containerClass = "p-6 max-w-5xl mx-auto";
const headerClass = "flex justify-between items-center mb-6";
const titleClass = "text-2xl font-bold";

const newGroupButtonClass =
  "px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800";
const emptyStateClass = "text-gray-600";
const groupListClass = "grid gap-4";
const groupCardClass =
  "block border rounded-lg p-4 hover:shadow transition";
const groupTitleClass = "text-lg font-semibold";
const groupMetaClass = "text-sm text-gray-600";
const groupDateClass = "text-sm text-gray-500";

interface Group {
  _id: string;
  name: string;
  participantCount: number;
  createdAt: string;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch("/api/groups", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch groups");

        const data = await res.json();
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

        <Link href="/admin/groups/" className={newGroupButtonClass}>
          + New Group
        </Link>
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
          <Link
            key={group._id}
            href={`/admin/groups/${group._id}`}
            className={groupCardClass}
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className={groupTitleClass}>{group.name}</h2>
                <p className={groupMetaClass}>
                  {group.participantCount} participants
                </p>
              </div>

              <span className={groupDateClass}>
                {new Date(group.createdAt).toLocaleDateString()}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
