'use client';

import React, { useEffect, useState } from "react";
import { getUserId } from "../../lib/auth";
import Link from "next/link";
import HistoryItem from "../../components/HistoryItem";

export const dynamic = "force-dynamic";

export default function HistoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        const { user } = await res.json();
        if (!user) {
          setError("请登录后查看历史记录。");
          setLoading(false);
          return;
        }
        const list = await fetch(`/api/history?userId=${user.id}`).then((r) => r.json());
        setItems(list);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p className="p-4">加载中...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  function handleDeleted(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="flex flex-col gap-3 p-4 max-w-2xl mx-auto">
      {items.map((s) => (
        <HistoryItem
          key={s.id}
          id={s.id}
          snippet={s.snippet}
          grammars={s.grammars}
          created={s.createdAt}
          onDeleted={() => handleDeleted(s.id)}
        />
      ))}
      {items.length === 0 && <p className="text-gray-500">暂无记录</p>}
    </div>
  );
} 