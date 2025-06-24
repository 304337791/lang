import React from "react";
import type { Question } from "@prisma/client";
import FavoriteButton from "./FavoriteButton";

interface Props {
  question: Question & {
    grammars: { grammar: { name: string } }[];
    vocabularies: { vocab: { word: string; phonetic: string; meaningCN: string } }[];
    favorites: any[];
  };
}

export default function ResultCard({ question }: Props) {
  return (
    <div className="border rounded p-4 bg-white dark:bg-gray-800">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold">
          {question.index}. {question.stem}
        </h3>
        <FavoriteButton
          questionId={question.id}
          defaultFavorited={question.favorites.length > 0}
        />
      </div>
      <p className="mt-2">
        <span className="font-semibold">正确答案：</span>
        {question.correctAns}
      </p>
      {question.userAnswer && (
        <p>
          <span className="font-semibold">你的答案：</span>
          {question.userAnswer}
        </p>
      )}
      <hr className="my-3 border-dashed" />
      <p className="whitespace-pre-wrap">
        <span className="font-semibold">解析：</span>
        {question.analysis}
      </p>
      <hr className="my-3 border-dashed" />
      <div className="mt-2">
        <span className="font-semibold">语法点：</span>
        {question.grammars.map((g) => g.grammar.name).join("，")}
      </div>
      <hr className="my-3 border-dashed" />
      <div>
        <span className="font-semibold">词汇：</span>
        {question.vocabularies
          .map((v) => `${v.vocab.word} (${v.vocab.phonetic}) - ${v.vocab.meaningCN}`)
          .join("； ")}
      </div>
    </div>
  );
} 