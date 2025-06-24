'use client';
import React, { useState, useEffect } from "react";
import UploadForm from "../components/UploadForm";
import ResultList from "../components/ResultList";

export default function Home() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const id = typeof window !== "undefined" ? localStorage.getItem("last_session") : null;
    if (id) setSessionId(id);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-start pt-10 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">AI 外语题目分析助手</h1>
      <UploadForm onFinished={setSessionId} />
      {sessionId && <ResultList sessionId={sessionId} />}
    </main>
  );
} 