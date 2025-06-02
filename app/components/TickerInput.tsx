"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type Suggestion = {
  symbol: string;
  name: string;
  exchange?: string;
  sector?: string;
  industry?: string;
};

export default function TickerInput() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatExchange = (code?: string) => {
    const map: Record<string, string> = {
      NMS: "NASDAQ",
      NYQ: "NYSE",
      ASE: "AMEX",
    };
    return code ? map[code] ?? code : "—";
  };

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/search/${query}`);
        const data = await res.json();
        setSuggestions(data);
        setShowDropdown(true);
      } catch {
        setSuggestions([]);
        setShowDropdown(false);
      }
    };

    fetchSuggestions();
  }, [query]);

  const handleSelect = (ticker: string) => {
    router.push(`/summary/${ticker.toUpperCase()}?ticker=${ticker.toUpperCase()}`);
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        handleSelect(suggestions[activeIndex].symbol);
      } else {
        handleSelect(query);
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="w-full max-w-xl flex flex-col gap-2 relative">
      <input
        ref={inputRef}
        autoFocus
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search stocks (e.g. Tesla, AAPL, Nvidia)"
        className="bg-zinc-900 text-white px-5 py-3 rounded-xl w-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
      />

      <AnimatePresence initial={false}>
        {showDropdown && (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="w-full"
          >
            <motion.ul
              initial={{ scaleY: 0.95 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0.95 }}
              transition={{ duration: 0.15 }}
              className="bg-zinc-800 rounded-xl shadow-lg border border-zinc-700 origin-top max-h-72 overflow-y-auto divide-y divide-zinc-700"
            >
              {suggestions.map((s, i) => (
                <li
                  key={s.symbol}
                  onClick={() => handleSelect(s.symbol)}
                  className={`flex justify-between items-start px-4 py-4 text-white text-sm sm:text-base cursor-pointer transition-all ${
                    i === activeIndex ? "bg-blue-600 ring-1 ring-blue-400 rounded-md" : "hover:bg-zinc-700"
                  }`}
                >
                  {/* Left: Symbol + Name */}
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg">{s.symbol}</span>
                    <span className="text-gray-300 text-sm">{s.name}</span>
                  </div>

                  {/* Right: Sector + Exchange */}
                  <div className="text-right text-gray-400 text-xs flex flex-col items-end gap-0.5">
                    <span className="bg-zinc-700 px-2 py-0.5 rounded-full text-white font-medium">
                      {s.sector || "—"}
                    </span>
                    <span className="text-blue-300 font-semibold">{formatExchange(s.exchange)}</span>
                  </div>
                </li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
