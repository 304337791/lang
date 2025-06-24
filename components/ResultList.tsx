'use client';

import React, { useEffect, useState } from "react";
import ResultCard from "./ResultCard";

interface Props {
  sessionId: string;
}

export default function ResultList({ sessionId }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/session/${sessionId}`, {
          cache: "no-store"
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setQuestions(data.questions || []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [sessionId]);

  if (loading) return <p className="mt-6">加载结果中...</p>;
  if (error) return <p className="mt-6 text-red-600">{error}</p>;
  if (!questions.length) return <p className="mt-6">暂无结果</p>;

  return (
    <div className="flex flex-col gap-4 mt-6 w-full max-w-3xl mx-auto px-2">
      {questions.map((q) => (
        <ResultCard key={q.id} question={q as any} />
      ))}
    </div>
  );
} 