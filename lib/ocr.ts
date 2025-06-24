import { createWorker } from "tesseract.js";

// 接收 File/Blob 直接交给 tesseract 识别，避免 ArrayBuffer 类型不匹配
export async function ocrImageToText(file: File): Promise<string> {
  const worker = await createWorker("eng");
  const {
    data: { text }
  } = await worker.recognize(file);
  await worker.terminate();
  return text;
} 