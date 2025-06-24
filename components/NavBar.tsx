'use client';

import React from "react";
import Link from "next/link";
import NavUser from "./NavUser";

export default function NavBar() {
  return (
    <nav className="w-full py-3 shadow bg-white dark:bg-gray-800">
      <div className="mx-auto w-full max-w-screen-md md:max-w-4xl flex gap-4 text-sm items-center px-2">
        <Link href="/" className="px-3 font-bold">
          AI 批改
        </Link>
        <Link href="/history">历史记录</Link>
        <Link href="/favorites">收藏</Link>
        <span className="flex-grow" />
        <NavUser />
      </div>
    </nav>
  );
} 