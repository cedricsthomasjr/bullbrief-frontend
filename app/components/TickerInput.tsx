"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { useTickerSuggestions } from "@/app/hooks/useTickerSuggestions";

export default function TickerInput() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestions = useTickerSuggestions(query, 6);

  const formatExchange = (code?: string) => {
    const map: Record<string, string> = { NMS: "NASDAQ", NYQ: "NYSE", ASE: "AMEX" };
    return code ? map[code] ?? code : "";
  };

  useEffect(() => {
    setShowDropdown(query.trim().length > 0 && suggestions.length > 0);
    setActiveIndex(-1);
  }, [query, suggestions.length]);

  const handleSelect = (ticker: string) => {
    router.push(`/summary/${ticker.toUpperCase()}`);
    setQuery("");
    setShowDropdown(false);
    setActiveIndex(-1);
  };

  const handleSearch = () => {
    if (query.trim()) handleSelect(query.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((p) => (p + 1) % Math.max(suggestions.length, 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((p) => (p - 1 + Math.max(suggestions.length, 1)) % Math.max(suggestions.length, 1)); }
    else if (e.key === "Enter") {
      e.preventDefault();
      if (showDropdown && activeIndex >= 0 && suggestions[activeIndex]) handleSelect(suggestions[activeIndex].symbol);
      else handleSelect(query);
    }
    else if (e.key === "Escape") { setShowDropdown(false); setActiveIndex(-1); }
  };

  return (
    <div className="w-full max-w-lg relative">
      {/* Input row */}
      <div className="bb-card relative flex items-center overflow-hidden" style={{ borderColor: "rgba(56,189,248,0.2)" }}>
        <Search className="absolute left-4 w-4 h-4 text-slate-600 pointer-events-none shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(query.trim().length > 0 && suggestions.length > 0)}
          onKeyDown={handleKeyDown}
          placeholder="Search NVDA, Apple, JPM, Tesla..."
          className="flex-1 bg-transparent text-blue-50 pl-11 pr-4 py-4 focus:outline-none placeholder-slate-600 text-sm"
        />
        <button
          onClick={handleSearch}
          className="shrink-0 mr-2 btn-gradient text-white text-xs font-bold px-4 py-2 rounded-lg tracking-tight transition-all"
        >
          Search
        </button>
      </div>

      {/* Dropdown */}
      <AnimatePresence initial={false}>
        {showDropdown && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className="bb-card absolute top-full mt-2 max-h-72 w-full overflow-y-auto overflow-x-hidden scrollbar-hide z-50 origin-top"
            style={{ borderColor: "rgba(56,189,248,0.15)" }}
          >
            {suggestions.map((s, i) => (
              <li
                key={s.symbol}
                onClick={() => handleSelect(s.symbol)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`flex justify-between items-center px-4 py-3 cursor-pointer border-l-2 transition-colors ${
                  i === activeIndex
                    ? "bg-sky-400/[0.08] border-sky-400"
                    : "border-transparent hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-blue-50 text-sm font-mono">{s.symbol}</span>
                  <span className="text-slate-500 text-xs truncate">{s.name}</span>
                </div>
                <div className="text-right flex flex-col items-end gap-1 ml-4 shrink-0">
                  {s.sector && <span className="text-[10px] text-slate-600">{s.sector}</span>}
                  {s.exchange && (
                    <span className="text-[10px] font-semibold text-sky-400">{formatExchange(s.exchange)}</span>
                  )}
                </div>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
