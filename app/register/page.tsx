'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [captcha, setCaptcha] = useState("");

  useEffect(() => {
    setA(Math.floor(Math.random() * 10) + 1);
    setB(Math.floor(Math.random() * 10) + 1);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, a, b, captcha })
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "注册失败");
    } else {
      window.location.href = "/";
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h1 className="text-xl font-semibold mb-4">注册</h1>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          placeholder="用户名"
          className="border p-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="密码"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex items-center gap-2 text-sm">
          <span>
            {a} + {b} =
          </span>
          <input
            value={captcha}
            onChange={(e) => setCaptcha(e.target.value)}
            className="border p-1 w-16 rounded text-center"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "注册中..." : "注册"}
        </button>
      </form>
      <p className="text-sm mt-3">
        已有账号？ <a className="text-blue-600 underline" href="/login">去登录</a>
      </p>
    </div>
  );
} 