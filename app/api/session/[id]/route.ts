import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(req: Request, { params }: any) {
  const { id } = params;
  try {
    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            grammars: { include: { grammar: true } },
            vocabularies: { include: { vocab: true } },
            favorites: true
          },
          orderBy: { index: "asc" }
        }
      }
    });
    if (!session) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    return NextResponse.json(session);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: any) {
  try {
    const { id } = params;
    await prisma.questionVocab.deleteMany({ where: { question: { sessionId: id } } });
    await prisma.questionGrammar.deleteMany({ where: { question: { sessionId: id } } });
    await prisma.question.deleteMany({ where: { sessionId: id } });
    await prisma.session.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
} 