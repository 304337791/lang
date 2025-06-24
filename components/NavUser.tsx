'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function NavUser() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMe() {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      setUser(data.user);
      setLoading(false);
    }
    fetchMe();
  }, []);

  if (loading) return null;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    location.reload();
  }

  return user ? (
    <div className="flex items-center gap-2 text-sm">
      <span>{user.email}</span>
      <button onClick={logout} className="text-blue-600 underline">
        退出
      </button>
    </div>
  ) : (
    <div className="flex items-center gap-3 text-sm">
      <Link href="/login" className="text-blue-600 underline">
        登录
      </Link>
      <Link href="/register" className="text-blue-600 underline">
        注册
      </Link>
    </div>
  );
} 