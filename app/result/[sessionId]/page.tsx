import React from "react";
import { prisma } from "../../../lib/prisma";
import ResultCard from "../../../components/ResultCard";

export default async function ResultPage({ params }: { params: { sessionId: string } }) {
  const { sessionId } = params;
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
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

  if (!session) return <div>未找到结果</div>;

  return (
    <div className="flex flex-col gap-4">
      {session.questions.map((q) => (
        <ResultCard key={q.id} question={q} />
      ))}
    </div>
  );
} 