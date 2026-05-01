"use client";
import { ReactNode } from "react";

type Props = {
  label: string;
  children: ReactNode;
};

export default function Tooltip({ label, children }: Props) {
  return (
    <div className="group relative w-full cursor-help">
      <div className="bg-zinc-800 px-3 py-1 rounded-full w-full text-left">
        {children}
      </div>
      <div className="bb-card absolute z-10 hidden group-hover:block top-full mt-1 left-0 w-64 text-xs text-gray-200 p-2">
        {label}
      </div>
    </div>
  );
}
