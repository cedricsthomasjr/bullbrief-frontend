"use client";

import React from "react";

type SWOTProps = {
  content: string;
};

const parseSWOTSection = (label: string, content: string): string[] => {
  const match = new RegExp(`\\*\\*${label}:\\*\\*[\\s\\n\\r]+([-\\s\\S]+?)(?=\\*\\*|$)`, "i").exec(content);
  if (!match) return [];
  return match[1]
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("-"))
    .map((line) => line.replace(/^-\s*/, ""));
};

const SWOTSection = ({
  title,
  points,
  color,
}: {
  title: string;
  points: string[];
  color: string;
}) => (
  <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl shadow-sm">
    <h3 className={`text-xl font-bold mb-3 text-${color}`}>{title}</h3>
    {points.length > 0 ? (
      <ul className="list-disc list-inside text-gray-200 space-y-1">
        {points.map((point, i) => (
          <li key={i}>{point}</li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-400 italic">No data available.</p>
    )}
  </div>
);

export default function SWOTCard({ content }: SWOTProps) {
  const strengths = parseSWOTSection("Strengths", content);
  const weaknesses = parseSWOTSection("Weaknesses", content);
  const opportunities = parseSWOTSection("Opportunities", content);
  const threats = parseSWOTSection("Threats", content);

  return (
    <section className="grid md:grid-cols-2 gap-6 mt-8">
      <SWOTSection title="Strengths" points={strengths} color="green-400" />
      <SWOTSection title="Weaknesses" points={weaknesses} color="red-400" />
      <SWOTSection title="Opportunities" points={opportunities} color="blue-400" />
      <SWOTSection title="Threats" points={threats} color="yellow-400" />
    </section>
  );
}
