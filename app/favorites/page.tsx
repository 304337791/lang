import React from "react";
import { prisma } from "../../lib/prisma";
import { getUserId } from "../../lib/auth";
import ResultCard from "../../components/ResultCard";

export const dynamic = "force-dynamic";

async function getData(userId: string) {
  const favorites = (await prisma.favorite.findMany({
    where: { userId },
    include: {
      question: {
        include: {
          grammars: { include: { grammar: true } },
          vocabularies: { include: { vocab: true } },
          favorites: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  })) as any[];

  const grammar: Record<string, number> = {};
  const vocabulary: Record<string, number> = {};
  for (const fav of favorites) {
    for (const g of fav.question.grammars) {
      grammar[g.grammar.name] = (grammar[g.grammar.name] || 0) + 1;
    }
    for (const v of fav.question.vocabularies) {
      vocabulary[v.vocab.word] = (vocabulary[v.vocab.word] || 0) + 1;
    }
  }
  return { grammar, vocabulary, favorites };
}

export default async function FavoritesPage() {
  const userId = await getUserId();
  if (!userId) {
    return <p className="p-4">请登录后查看收藏。</p>;
  }

  const { grammar, vocabulary, favorites } = await getData(userId);

  return (
    <div className="space-y-8 p-4 max-w-3xl mx-auto">
      {/* 统计信息 */}
      <section>
        <h2 className="font-semibold text-xl mb-3">收藏统计</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-1">语法点汇总</h3>
            {Object.keys(grammar).length === 0 ? (
              <p className="text-gray-500 text-sm">暂无收藏语法点</p>
            ) : (
              <ul className="list-disc list-inside text-sm">
                {Object.entries(grammar).map(([g, count]) => (
                  <li key={g}>
                    {g} × {count as number}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3 className="font-semibold mb-1">词汇汇总</h3>
            {Object.keys(vocabulary).length === 0 ? (
              <p className="text-gray-500 text-sm">暂无收藏词汇</p>
            ) : (
              <ul className="list-disc list-inside text-sm">
                {Object.entries(vocabulary).map(([w, count]) => (
                  <li key={w}>
                    {w} × {count as number}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* 收藏的题目 */}
      <section className="space-y-4">
        <h2 className="font-semibold text-xl mb-3">已收藏题目</h2>
        {favorites.length === 0 ? (
          <p className="text-gray-500">暂无收藏</p>
        ) : (
          favorites.map((f) => (
            <ResultCard key={f.id} question={f.question as any} />
          ))
        )}
      </section>
    </div>
  );
} 