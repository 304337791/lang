'use client';
import React, { useState } from "react";
import Spinner from "./Spinner";

interface Props {
  onFinished: (sessionId: string) => void;
}

export default function UploadForm({ onFinished }: Props) {
  const [text, setText] = useState(""); // 手动复制题干（可选）
  const [image, setImage] = useState<File | null>(null); // 拍照/上传的图片
  const [loading, setLoading] = useState(false);

  // 提交到后端
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() && !image) return; // 必须有文字或图片其一

    const formData = new FormData();
    formData.append("rawText", text);
    if (image) formData.append("image", image);

    setLoading(true);
    const res = await fetch("/api/analyze", {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    setLoading(false);
    if (data.sessionId) {
      if (typeof window !== "undefined") {
        localStorage.setItem("last_session", data.sessionId);
      }
      onFinished(data.sessionId);
    }
  }

  // 选择 / 拍照
  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setImage(file);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full sm:max-w-xl mx-auto p-4 border rounded-lg shadow-md bg-white">
      {/* 拍照按钮 */}
      <div className="flex justify-center gap-4">
        {/* 拍照 */}
        <input
          id="camera-input"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImage}
          className="hidden"
        />
        <label htmlFor="camera-input" className="inline-flex items-center gap-2 px-5 py-3 text-lg font-semibold text-white bg-green-600 rounded-lg cursor-pointer hover:bg-green-700 active:scale-95 transition-transform">
          📷 拍照
        </label>

        {/* 相册上传 */}
        <input
          id="gallery-input"
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="hidden"
        />
        <label htmlFor="gallery-input" className="inline-flex items-center gap-2 px-5 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700 active:scale-95 transition-transform">
          🖼 上传
        </label>
      </div>

      {/* 预览已选择的图片 */}
      {image && (
        <img
          src={URL.createObjectURL(image)}
          alt="preview"
          className="max-h-64 object-contain border rounded"
        />
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="可选：粘贴题目文本"
        className="w-full h-40 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        type="submit"
        disabled={loading || (!text.trim() && !image)}
        className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 hover:bg-blue-700 transition-colors"
      >
        {loading && <Spinner size={20} />}
        {loading ? "分析中..." : "开始分析"}
      </button>
    </form>
  );
} 