import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getOpenAI } from "../../../lib/openai";
import { prisma } from "../../../lib/prisma";
import { Buffer } from "node:buffer";
import { getUserId } from "../../../lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // 支持 multipart/form-data
    const formData = await req.formData();
    const rawText = (formData.get("rawText") as string) || "";
    const file = formData.get("image") as File | null;

    // 构造聊天内容
    const userContent: any[] = [];
    if (rawText.trim()) {
      userContent.push({ type: "text", text: rawText });
    }

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString("base64");
      userContent.push({
        type: "image_url",
        image_url: {
          url: `data:${file.type};base64,${base64}`
        }
      });
    }

    if (userContent.length === 0) {
      return NextResponse.json({ error: "No input provided" }, { status: 400 });
    }

    // 匿名用户每日限 5 次
    const currentUserId = await getUserId();
    if (!currentUserId) {
      const store = await cookies();
      const used = Number(store.get("anon_used")?.value || "0");
      if (used >= 5) {
        return NextResponse.json({ error: "匿名用户每天限用 5 次，请注册后继续使用" }, { status: 429 });
      }
    }

    const openai = getOpenAI();
    const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-2025-04-14";
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `你是资深外语教研专家，请对输入的题目进行深度解析，并以 JSON 形式返回，不要添加任何多余说明。要求：
1. questions 为数组，保持题目原有顺序，字段如下：
  • index: 题号（数字）
  • stem: 原题干（字符串）
   - 必须完整保留题目原文，包括所有选项、标点与格式
  • user_answer: 用户答案（如无则留空或 null）
  • correct_answer: 正确答案，若有多个或需说明写清楚
  • analysis: 用流畅准确的中文，详细说明正确答案的理由，涉及到的语法现象和词汇用法，字数不少于 120 字，可使用多段落
  • grammar_points: 语法点数组，每个元素为该语法点的名称（中文）
  • vocabulary: 词汇数组，每个元素包含：word, phonetic, pos, roots（词根/构词法）, meaning_cn（中文释义）, expands（含派生词或常用搭配，数组）

示例 JSON 结构：{"questions":[{"index":1,"stem":"...","user_answer":"...","correct_answer":"...","analysis":"...","grammar_points":["虚拟语气"],"vocabulary":[{"word":"commit","phonetic":"/kəˈmɪt/","pos":"v.","roots":"com(一起)+mit(送)","meaning_cn":"犯(错);承诺","expands":["commitment","committee"]}]}]}`
        },
        { role: "user", content: userContent }
      ]
    });

    const content = completion.choices[0].message.content || "{}";
    const data = JSON.parse(content);

    // 建 session
    const session = await prisma.session.create({ data: { userId: currentUserId || undefined } });

    for (const q of data.questions) {
      const question = await prisma.question.create({
        data: {
          sessionId: session.id,
          index: q.index,
          stem: q.stem,
          userAnswer: q.user_answer ?? null,
          correctAns: q.correct_answer,
          analysis: q.analysis
        }
      });

      // grammar - 去重避免重复插入
      const grammarSet = new Set<string>(q.grammar_points || []);
      for (const gName of grammarSet) {
        const gp = await prisma.grammarPoint.upsert({
          where: { name: gName },
          update: {},
          create: { name: gName, tips: "" }
        });
        await prisma.questionGrammar.create({
          data: { questionId: question.id, grammarId: gp.id }
        });
      }

      // vocabulary - 去重（按单词）
      const vocabMap: Record<string, any> = {};
      for (const v of q.vocabulary || []) {
        if (v && v.word && vocabMap[v.word]) continue;
        if (v && v.word) vocabMap[v.word] = v; // 标记已处理
        const voc = await prisma.vocabulary.create({
          data: {
            word: v.word ?? "",
            phonetic: v.phonetic ?? "",
            pos: v.pos ?? "",
            roots: v.roots ?? "",
            expands: (v.expands || []).join(", "),
            meaningCN: v.meaning_cn ?? ""
          }
        });
        await prisma.questionVocab.create({
          data: { questionId: question.id, vocabId: voc.id }
        });
      }
    }

    const response = NextResponse.json({ sessionId: session.id });
    if (!currentUserId) {
      const store = await cookies();
      const used = Number(store.get("anon_used")?.value || "0");
      response.cookies.set("anon_used", String(used + 1), { maxAge: 60 * 60 * 24, path: "/" });
    }
    return response;
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
} 