import "../styles/globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import NavBar from "../components/NavBar";

export const metadata: Metadata = {
  title: "AI 外语题目批改",
  description: "使用 OpenAI 进行外语题目批改与讲解"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hans" className="h-full" suppressHydrationWarning>
      <body className="min-h-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-base md:text-lg">
        <NavBar />
        <main className="w-full max-w-5xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
} 