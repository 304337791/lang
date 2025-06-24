'use client';

import React, { useState } from "react";
import Link from "next/link";

interface Props {
  id: string;
  snippet: string;
  grammars: string;
  created: string;
  onDeleted: () => void;
}

export default function HistoryItem({ id, snippet, grammars, created, onDeleted }: Props) {
  const [loading, setLoading] = useState(false);

  async function remove() {
    if (!confirm("确认删除该记录？")) return;
    setLoading(true);
    await fetch(`/api/session/${id}`, { method: "DELETE" });
    onDeleted();
  }

  return (
    <div className="flex items-start gap-3 p-3 border rounded hover:bg-gray-50">
      <div className="flex-grow">
        <Link href={`/result/${id}`} className="text-sm text-gray-700 truncate font-medium">
          {snippet}
        </Link>
        {grammars && <div className="text-xs text-gray-500 mt-0.5">语法：{grammars}</div>}
        <div className="text-xs text-gray-400 mt-0.5">{new Date(created).toLocaleString()}</div>
      </div>
      <button onClick={remove} disabled={loading} className="text-red-500 text-lg">
        🗑
      </button>
    </div>
  );
} 