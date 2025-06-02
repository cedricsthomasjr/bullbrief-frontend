"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import TickerInput from "@/app/components/TickerInput";
import MarketCard from "@/app/components/MarketCard";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen bg-black text-white px-6 pt-20 overflow-x-hidden">
      {/* 🔵 Background Glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black via-blue-950 to-black opacity-60 blur-2xl" />
      

      {/* 🏁 Hero */}
      <section className="flex flex-col items-center text-center space-y-6 z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-tr from-blue-500 to-cyan-300 bg-clip-text text-transparent drop-shadow-xl"
        >
          BullBrief
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-400 text-lg sm:text-xl max-w-2xl"
        >
          AI-powered public company summaries. Fast. Clear. Investor-ready.
        </motion.p>
      </section>

      <motion.section
  layout
  className="mt-16 z-10 w-full flex flex-col items-center gap-10"
>
  <TickerInput />

  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="bg-gradient-to-br from-blue-800 to-cyan-600 p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-3xl text-center"
  >
    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
      Deep Compare Mode
    </h2>
    <p className="text-gray-100 text-md sm:text-lg mb-4">
      Side-by-side company breakdowns across fundamentals, valuation, outlook, and more.
    </p>
    <button
      onClick={() => router.push("/compare")}
      className="bg-white text-blue-800 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-all duration-200"
    >
      Compare Companies →
    </button>
  </motion.div>
</motion.section>


      
    </main>
  );
}
