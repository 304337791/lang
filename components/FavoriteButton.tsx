'use client';

import React, { useState } from "react";

interface Props {
  questionId: string;
  defaultFavorited: boolean;
}

export default function FavoriteButton({ questionId, defaultFavorited }: Props) {
  const [favorited, setFavorited] = useState(defaultFavorited);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const res = await fetch("/api/favorite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId })
    });
    if (res.status === 401) {
      alert("请先登录后再收藏");
    } else {
      const data = await res.json();
      setFavorited(data.favorited);
    }
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={`text-2xl leading-none transition-colors duration-200 ${favorited ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
    >
      {favorited ? "❤️" : "♡"}
    </button>
  );
} 