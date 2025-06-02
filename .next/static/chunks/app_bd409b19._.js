(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/app/components/SWOTCard.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>SWOTCard)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
const parseSWOTSection = (label, content)=>{
    const match = new RegExp(`\\*\\*${label}:\\*\\*[\\s\\n\\r]+([-\\s\\S]+?)(?=\\*\\*|$)`, "i").exec(content);
    if (!match) return [];
    return match[1].split("\n").map((line)=>line.trim()).filter((line)=>line.startsWith("-")).map((line)=>line.replace(/^-\s*/, ""));
};
const SWOTSection = ({ title, points, color })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-zinc-900 border border-zinc-700 p-6 rounded-xl shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: `text-xl font-bold mb-3 text-${color}`,
                children: title
            }, void 0, false, {
                fileName: "[project]/app/components/SWOTCard.tsx",
                lineNumber: 29,
                columnNumber: 5
            }, this),
            points.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "list-disc list-inside text-gray-200 space-y-1",
                children: points.map((point, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        children: point
                    }, i, false, {
                        fileName: "[project]/app/components/SWOTCard.tsx",
                        lineNumber: 33,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/components/SWOTCard.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-400 italic",
                children: "No data available."
            }, void 0, false, {
                fileName: "[project]/app/components/SWOTCard.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/SWOTCard.tsx",
        lineNumber: 28,
        columnNumber: 3
    }, this);
_c = SWOTSection;
function SWOTCard({ content }) {
    const strengths = parseSWOTSection("Strengths", content);
    const weaknesses = parseSWOTSection("Weaknesses", content);
    const opportunities = parseSWOTSection("Opportunities", content);
    const threats = parseSWOTSection("Threats", content);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "grid md:grid-cols-2 gap-6 mt-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SWOTSection, {
                title: "Strengths",
                points: strengths,
                color: "green-400"
            }, void 0, false, {
                fileName: "[project]/app/components/SWOTCard.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SWOTSection, {
                title: "Weaknesses",
                points: weaknesses,
                color: "red-400"
            }, void 0, false, {
                fileName: "[project]/app/components/SWOTCard.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SWOTSection, {
                title: "Opportunities",
                points: opportunities,
                color: "blue-400"
            }, void 0, false, {
                fileName: "[project]/app/components/SWOTCard.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SWOTSection, {
                title: "Threats",
                points: threats,
                color: "yellow-400"
            }, void 0, false, {
                fileName: "[project]/app/components/SWOTCard.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/SWOTCard.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_c1 = SWOTCard;
var _c, _c1;
__turbopack_context__.k.register(_c, "SWOTSection");
__turbopack_context__.k.register(_c1, "SWOTCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/LoadingScreen.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>LoadingScreen)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const funFacts = [
    "📈 Warren Buffett bought his first stock at age 11.",
    "💰 The S&P 500 has averaged ~10% annual returns since inception.",
    "🏦 The NYSE was founded in 1792 under a buttonwood tree on Wall Street.",
    "🚗 Tesla first turned a profit in Q3 of 2019.",
    "🧠 Peter Lynch averaged 29% annual returns managing the Magellan Fund.",
    "🌍 Only ~60 companies in the world have a $200B+ market cap.",
    "📉 The largest single-day Dow drop was -2,997 points on March 16, 2020.",
    "📱 Apple’s market cap once surpassed the GDP of the UK.",
    "🔁 Stock market corrections (10%+ drops) happen every 1-2 years on average.",
    "📆 October is historically the most volatile month for U.S. stocks.",
    "🧾 Dividends account for roughly 40% of total S&P 500 returns over time.",
    "🧮 The P/E ratio is one of the most common valuation metrics investors use.",
    "🌡️ Inflation eats away at returns — that's why real return > nominal return.",
    "📦 Amazon didn’t turn a yearly profit until 2003 — 9 years after launching.",
    "🎯 Dollar-cost averaging can reduce timing risk over long investment periods.",
    "🧬 The Nasdaq is more tech-heavy, while the Dow is price-weighted.",
    "📉 Bear markets typically last less than a year, while bull markets last ~3.8 years on average.",
    "💸 Buying during fear can outperform selling during hype.",
    "🚀 In 2020, retail investors drove GameStop up over 1,700% in a month.",
    "🌎 U.S. stocks make up ~60% of the global equity market cap.",
    "🔄 The VIX is a volatility index — often called the market’s “fear gauge.”",
    "🔒 Bonds are generally less volatile than stocks, but offer lower returns.",
    "🪙 Bitcoin was worth less than a penny in 2010 — now over $60,000 at peak.",
    "🏛️ The Fed doesn’t set stock prices, but it heavily influences them via rates.",
    "📚 Long-term investing tends to outperform short-term trading for most investors."
];
function LoadingScreen({ isLoading = true }) {
    _s();
    const [currentFactIndex, setCurrentFactIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LoadingScreen.useEffect": ()=>{
            if (!isLoading) return;
            const interval = setInterval({
                "LoadingScreen.useEffect.interval": ()=>{
                    setCurrentFactIndex({
                        "LoadingScreen.useEffect.interval": (prev)=>(prev + 1) % funFacts.length
                    }["LoadingScreen.useEffect.interval"]);
                }
            }["LoadingScreen.useEffect.interval"], 3000);
            return ({
                "LoadingScreen.useEffect": ()=>clearInterval(interval)
            })["LoadingScreen.useEffect"];
        }
    }["LoadingScreen.useEffect"], [
        isLoading
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        children: isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            className: "fixed inset-0 z-50 bg-black text-white flex flex-col items-center justify-center space-y-6 px-4 text-center",
            initial: {
                opacity: 0
            },
            animate: {
                opacity: 1
            },
            exit: {
                opacity: 0
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].h1, {
                    className: "text-2xl font-semibold text-blue-400",
                    initial: {
                        opacity: 0,
                        y: -10
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    transition: {
                        delay: 0.2
                    },
                    children: "Generating Summary..."
                }, void 0, false, {
                    fileName: "[project]/app/components/LoadingScreen.tsx",
                    lineNumber: 56,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].p, {
                    className: "text-sm text-gray-300 max-w-md",
                    initial: {
                        opacity: 0,
                        y: 10
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        y: -10
                    },
                    transition: {
                        duration: 0.5
                    },
                    children: funFacts[currentFactIndex]
                }, currentFactIndex, false, {
                    fileName: "[project]/app/components/LoadingScreen.tsx",
                    lineNumber: 65,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-8 w-8 rounded-full border-t-2 border-blue-400 border-opacity-50 animate-spin"
                }, void 0, false, {
                    fileName: "[project]/app/components/LoadingScreen.tsx",
                    lineNumber: 76,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/LoadingScreen.tsx",
            lineNumber: 50,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/LoadingScreen.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, this);
}
_s(LoadingScreen, "VOR90w369egUrMMrycBJHg/7d4g=");
_c = LoadingScreen;
var _c;
__turbopack_context__.k.register(_c, "LoadingScreen");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/TradingViewMiniChart.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>TradingViewMiniChart)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function TradingViewMiniChart({ symbol }) {
    _s();
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TradingViewMiniChart.useEffect": ()=>{
            if (!containerRef.current) return;
            // Clear previous chart if it exists
            containerRef.current.innerHTML = "";
            const script = document.createElement("script");
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
            script.async = true;
            script.innerHTML = JSON.stringify({
                symbol,
                width: "100%",
                height: "100%",
                locale: "en",
                dateRange: "12M",
                colorTheme: "dark",
                isTransparent: true,
                autosize: true
            });
            containerRef.current.appendChild(script);
        }
    }["TradingViewMiniChart.useEffect"], [
        symbol
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: "w-full h-64 rounded-xl overflow-hidden"
    }, void 0, false, {
        fileName: "[project]/app/components/TradingViewMiniChart.tsx",
        lineNumber: 31,
        columnNumber: 10
    }, this);
}
_s(TradingViewMiniChart, "8puyVO4ts1RhCfXUmci3vLI3Njw=");
_c = TradingViewMiniChart;
var _c;
__turbopack_context__.k.register(_c, "TradingViewMiniChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/TradingViewFullChart.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>TradingViewFullChart)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function TradingViewFullChart({ symbol }) {
    _s();
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TradingViewFullChart.useEffect": ()=>{
            if (!containerRef.current) return;
            containerRef.current.innerHTML = "";
            const script = document.createElement("script");
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
            script.async = true;
            script.innerHTML = JSON.stringify({
                autosize: true,
                symbol,
                interval: "D",
                timezone: "Etc/UTC",
                theme: "dark",
                style: "1",
                locale: "en",
                enable_publishing: false,
                allow_symbol_change: false,
                hide_top_toolbar: false,
                hide_legend: false,
                save_image: false,
                studies: [
                    "MACD@tv-basicstudies",
                    "Volume@tv-basicstudies"
                ]
            });
            containerRef.current.appendChild(script);
        }
    }["TradingViewFullChart.useEffect"], [
        symbol
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: "w-full h-[500px] rounded-xl"
    }, void 0, false, {
        fileName: "[project]/app/components/TradingViewFullChart.tsx",
        lineNumber: 36,
        columnNumber: 10
    }, this);
}
_s(TradingViewFullChart, "8puyVO4ts1RhCfXUmci3vLI3Njw=");
_c = TradingViewFullChart;
var _c;
__turbopack_context__.k.register(_c, "TradingViewFullChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/StockChartToggle.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>StockChartToggle)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TradingViewMiniChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/TradingViewMiniChart.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TradingViewFullChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/TradingViewFullChart.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function StockChartToggle({ symbol }) {
    _s();
    const [view, setView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("mini");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setView("mini"),
                        className: `px-4 py-2 text-sm rounded-md border transition ${view === "mini" ? "bg-blue-500 text-white border-blue-600" : "bg-zinc-800 text-gray-300 border-zinc-700 hover:border-blue-400"}`,
                        children: "Mini Overview"
                    }, void 0, false, {
                        fileName: "[project]/app/components/StockChartToggle.tsx",
                        lineNumber: 14,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setView("full"),
                        className: `px-4 py-2 text-sm rounded-md border transition ${view === "full" ? "bg-blue-500 text-white border-blue-600" : "bg-zinc-800 text-gray-300 border-zinc-700 hover:border-blue-400"}`,
                        children: "Full Chart"
                    }, void 0, false, {
                        fileName: "[project]/app/components/StockChartToggle.tsx",
                        lineNumber: 24,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/StockChartToggle.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border border-zinc-700 bg-zinc-900 rounded-xl p-4 shadow-md",
                children: view === "mini" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TradingViewMiniChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    symbol: symbol
                }, void 0, false, {
                    fileName: "[project]/app/components/StockChartToggle.tsx",
                    lineNumber: 39,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TradingViewFullChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    symbol: symbol
                }, void 0, false, {
                    fileName: "[project]/app/components/StockChartToggle.tsx",
                    lineNumber: 41,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/StockChartToggle.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/StockChartToggle.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_s(StockChartToggle, "T8nbJEJTQVcNuDhx1tShVqL8t3M=");
_c = StockChartToggle;
var _c;
__turbopack_context__.k.register(_c, "StockChartToggle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/lib/format.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// /app/lib/format.ts
__turbopack_context__.s({
    "formatFixed": (()=>formatFixed),
    "formatNumber": (()=>formatNumber),
    "formatPercent": (()=>formatPercent)
});
function formatNumber(value) {
    if (value === null || value === undefined || isNaN(value)) return "N/A";
    const abs = Math.abs(value);
    let suffix = "";
    let scaled = value;
    if (abs >= 1e12) {
        suffix = "T";
        scaled = value / 1e12;
    } else if (abs >= 1e9) {
        suffix = "B";
        scaled = value / 1e9;
    } else if (abs >= 1e6) {
        suffix = "M";
        scaled = value / 1e6;
    } else if (abs >= 1e3) {
        suffix = "K";
        scaled = value / 1e3;
    }
    return `${scaled.toFixed(2)}${suffix}`;
}
function formatPercent(value) {
    return value !== null && value !== undefined ? `${(value * 100).toFixed(2)}%` : "N/A";
}
function formatFixed(value) {
    return value !== null && value !== undefined ? value.toFixed(2) : "N/A";
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/EPSChartCard.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>EPSChartCard)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/ResponsiveContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/BarChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Bar.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Line.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/XAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/YAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Tooltip.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/CartesianGrid.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function EPSChartCard({ ticker }) {
    _s();
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EPSChartCard.useEffect": ()=>{
            const fetchEPS = {
                "EPSChartCard.useEffect.fetchEPS": async ()=>{
                    try {
                        const res = await fetch(`${("TURBOPACK compile-time value", "https://bullbrief-api.onrender.com")}/eps-history/${ticker}`);
                        const json = await res.json();
                        const sorted = [
                            ...json.eps_history
                        ].sort({
                            "EPSChartCard.useEffect.fetchEPS.sorted": (a, b)=>parseInt(a.year) - parseInt(b.year)
                        }["EPSChartCard.useEffect.fetchEPS.sorted"]);
                        setData(sorted);
                    } catch (err) {
                        console.error("Failed to fetch EPS history", err);
                    } finally{
                        setLoading(false);
                    }
                }
            }["EPSChartCard.useEffect.fetchEPS"];
            fetchEPS();
        }
    }["EPSChartCard.useEffect"], [
        ticker
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-zinc-900 p-6 rounded-2xl shadow-lg text-white",
            children: "Loading EPS data..."
        }, void 0, false, {
            fileName: "[project]/app/components/EPSChartCard.tsx",
            lineNumber: 45,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-zinc-900 p-6 rounded-2xl shadow-lg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-white text-xl font-semibold mb-4",
                children: [
                    "EPS History (",
                    ticker.toUpperCase(),
                    ")"
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/EPSChartCard.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                width: "100%",
                height: 300,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BarChart"], {
                    data: data,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                            strokeDasharray: "3 3",
                            stroke: "#2a2a2a"
                        }, void 0, false, {
                            fileName: "[project]/app/components/EPSChartCard.tsx",
                            lineNumber: 58,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
                            dataKey: "year",
                            stroke: "#999"
                        }, void 0, false, {
                            fileName: "[project]/app/components/EPSChartCard.tsx",
                            lineNumber: 59,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {
                            stroke: "#999"
                        }, void 0, false, {
                            fileName: "[project]/app/components/EPSChartCard.tsx",
                            lineNumber: 60,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                            contentStyle: {
                                backgroundColor: "#111",
                                border: "none"
                            },
                            labelStyle: {
                                color: "#fff"
                            },
                            itemStyle: {
                                color: "#3b82f6"
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/components/EPSChartCard.tsx",
                            lineNumber: 61,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bar"], {
                            dataKey: "eps",
                            fill: "#3b82f6",
                            radius: [
                                4,
                                4,
                                0,
                                0
                            ]
                        }, void 0, false, {
                            fileName: "[project]/app/components/EPSChartCard.tsx",
                            lineNumber: 66,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                            type: "monotone",
                            dataKey: "eps",
                            stroke: "#60a5fa",
                            strokeWidth: 2,
                            dot: {
                                r: 3,
                                fill: "#60a5fa"
                            },
                            activeDot: {
                                r: 5
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/components/EPSChartCard.tsx",
                            lineNumber: 67,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/EPSChartCard.tsx",
                    lineNumber: 57,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/EPSChartCard.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/EPSChartCard.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_s(EPSChartCard, "YP7e7Smzxlgf2d3MqLcgRZjo83U=");
_c = EPSChartCard;
var _c;
__turbopack_context__.k.register(_c, "EPSChartCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/EPSChartModal.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>EPSChartModal)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$EPSChartCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/EPSChartCard.tsx [app-client] (ecmascript)");
"use client";
;
;
;
function EPSChartModal({ onClose, ticker }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-2xl mx-4 p-6 relative shadow-lg",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onClose,
                    className: "absolute top-4 right-4 text-gray-400 hover:text-red-400",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                        className: "w-5 h-5"
                    }, void 0, false, {
                        fileName: "[project]/app/components/EPSChartModal.tsx",
                        lineNumber: 20,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/EPSChartModal.tsx",
                    lineNumber: 16,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-xl text-blue-300 font-semibold mb-4",
                    children: [
                        "📊 EPS History – ",
                        ticker
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/EPSChartModal.tsx",
                    lineNumber: 22,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$EPSChartCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    ticker: ticker
                }, void 0, false, {
                    fileName: "[project]/app/components/EPSChartModal.tsx",
                    lineNumber: 25,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/EPSChartModal.tsx",
            lineNumber: 15,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/EPSChartModal.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_c = EPSChartModal;
var _c;
__turbopack_context__.k.register(_c, "EPSChartModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/FinancialMetricsGrid.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>FinancialMetricsGrid)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$pie$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PieChart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-pie.js [app-client] (ecmascript) <export default as PieChart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LineChart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-line.js [app-client] (ecmascript) <export default as LineChart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.js [app-client] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$badge$2d$percent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BadgePercent$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/badge-percent.js [app-client] (ecmascript) <export default as BadgePercent>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$area$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AreaChart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-area.js [app-client] (ecmascript) <export default as AreaChart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$piggy$2d$bank$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PiggyBank$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/piggy-bank.js [app-client] (ecmascript) <export default as PiggyBank>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$banknote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Banknote$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/banknote.js [app-client] (ecmascript) <export default as Banknote>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleDollarSign$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-dollar-sign.js [app-client] (ecmascript) <export default as CircleDollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$percent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Percent$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/percent.js [app-client] (ecmascript) <export default as Percent>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDownUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-down-up.js [app-client] (ecmascript) <export default as ArrowDownUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/format.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$EPSChartModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/EPSChartModal.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function FinancialMetricsGrid({ data }) {
    _s();
    const [showModal, setShowModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const metricGroups = [
        {
            title: " Valuation Metrics",
            metrics: [
                {
                    label: "EPS (TTM)",
                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatFixed"])(data.eps_ttm),
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                        className: "w-4 h-4 text-blue-400"
                    }, void 0, false, {
                        fileName: "[project]/app/components/FinancialMetricsGrid.tsx",
                        lineNumber: 60,
                        columnNumber: 71
                    }, this)
                },
                {
                    label: "Forward P/E",
                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatFixed"])(data.forward_pe),
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LineChart$3e$__["LineChart"], {
                        className: "w-4 h-4 text-blue-400"
                    }, void 0, false, {
                        fileName: "[project]/app/components/FinancialMetricsGrid.tsx",
                        lineNumber: 61,
                        columnNumber: 76
                    }, this)
                },
                {
                    label: "PEG Ratio",
                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatFixed"])(data.peg_ratio),
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                        className: "w-4 h-4 text-blue-400"
                    }, void 0, false, {
                        fileName: "[project]/app/components/FinancialMetricsGrid.tsx",
                        lineNumber: 62,
                        columnNumber: 73
                    }, this)
                },
                {
                    label: "Price to Sales",
                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatFixed"])(data.price_to_sales),
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$pie$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PieChart$3e$__["PieChart"], {
                        className: "w-4 h-4 text-blue-400"
                    }, void 0, false, {
                        fileName: "[project]/app/components/FinancialMetricsGrid.tsx",
                        lineNumber: 63,
                        columnNumber: 83
                    }, this)
                },
                {
                    label: "Price to Book",
                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatFixed"])(data.price_to_book),
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                        className: "w-4 h-4 text-blue-400"
                    }, void 0, false, {
                        fileName: "[project]/app/components/FinancialMetricsGrid.tsx",
                        lineNumber: 64,
                        columnNumber: 81
                    }, this)
                }
            ]
        },
        {
            title: " Risk & Ownership",
            metrics: [
                {
                    label: "Beta",
                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatFixed"])(data.beta),
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                        className: "w-4 h-4 text-blue-400"
                    }, void 0, false, {
                        fileName: "[project]/app/components/FinancialMetricsGrid.tsx",
                        lineNumber: 70,
                        columnNumber: 63
                    }, this)
                },
                {
                    label: "Volume",
                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNumber"])(data.volume),
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDownUp$3e$__["ArrowDownUp"], {
                        className: "w-4 h-4 text-blue-400"
                    }, void 0, false, {
                        fileName: "[project]/app/components/FinancialMetricsGrid.tsx",
                        lineNumber: 71,
                        columnNumber: 68
                    }, this)
                },
                {
                    label: "Avg Volume",
                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNumber"])(data.avg_volume),
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDownUp$3e$__["ArrowDownUp"], {
                        className: "w-4 h-4 text-blue-400"
                    }, void 0, false, {
                        fileName: "[project]/app/components/FinancialMetricsGrid.tsx",
                        lineNumber: 72,
                        columnNumber: 76
                    }, this)
                },
                {
                    label: "Short % of Float",
                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPercent"])(data.short_percent),
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$badge$2d$percent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BadgePercent$3e$__["BadgePercent"], {
                        className: "w-4 h-4 text-blue-400"
                    }, void 0, false, {
                        fileName: "[project]/app/components/FinancialMetricsGrid.tsx",
                        lineNumber: 73,
                        columnNumber: 86
                    }, this)
                },
                {
                    label: "Institutional Ownership",
                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPercent"])(data.institutional_ownership),
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                        className: "w-4 h-4 text-blue-400"
                    }, void 0, false, {
                        fileName: "[project]/app/components/FinancialMetricsGrid.tsx",
                        lineNumber: 74,
                        columnNumber: 103
                    }, this)
                }
            ]
        },
        {
            title: " Profitability & Cashflow",
            metrics: [
                {
                    label: "Dividend Yield",
                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPercent"])(data.dividend_yield),
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$piggy$2d$bank$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PiggyBank$3e$__["PiggyBank"], {
                        className: "w-4 h-4 text-blue-400"
                    }, void 0, false, {
                        fileName: "[project]/app/components/FinancialMetricsGrid.tsx",
                        lineNumber: 80,
                        columnNumber: 85
                    }, this)
                },
                {
                    label: "ROE",
                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPercent"])(data.roe),
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$percent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Percent$3e$__["Percent"], {
                        className: "w-4 h-4 text-blue-400"
                    }, void 0, false, {
                        fileName: "[project]/app/components/FinancialMetricsGrid.tsx",
                        lineNumber: 81,
                        columnNumber: 63
                    }, this)
                },
                {
                    label: "Profit Margin",
                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPercent"])(data.profit_margin),
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleDollarSign$3e$__["CircleDollarSign"], {
                        className: "w-4 h-4 text-blue-400"
                    }, void 0, false, {
                        fileName: "[project]/app/components/FinancialMetricsGrid.tsx",
                        lineNumber: 82,
                        columnNumber: 83
                    }, this)
                },
                {
                    label: "Free Cash Flow",
                    value: `$${(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNumber"])(data.free_cashflow)}`,
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$banknote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Banknote$3e$__["Banknote"], {
                        className: "w-4 h-4 text-blue-400"
                    }, void 0, false, {
                        fileName: "[project]/app/components/FinancialMetricsGrid.tsx",
                        lineNumber: 83,
                        columnNumber: 89
                    }, this)
                },
                {
                    label: "Debt to Equity",
                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatFixed"])(data.debt_to_equity),
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$area$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AreaChart$3e$__["AreaChart"], {
                        className: "w-4 h-4 text-blue-400"
                    }, void 0, false, {
                        fileName: "[project]/app/components/FinancialMetricsGrid.tsx",
                        lineNumber: 84,
                        columnNumber: 83
                    }, this)
                }
            ]
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12",
        children: [
            metricGroups.map((group, groupIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-bold text-blue-200",
                            children: group.title
                        }, void 0, false, {
                            fileName: "[project]/app/components/FinancialMetricsGrid.tsx",
                            lineNumber: 95,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6",
                            children: group.metrics.map((item, idx)=>{
                                const isEPS = item.label === "EPS (TTM)";
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative group bg-zinc-900 p-4 rounded-xl border border-zinc-700 hover:border-blue-500 transition duration-200",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-400 text-xs",
                                            children: item.label
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/FinancialMetricsGrid.tsx",
                                            lineNumber: 104,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-white text-lg font-semibold flex items-center gap-2 mt-1",
                                            children: [
                                                item.icon,
                                                " ",
                                                item.value
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/FinancialMetricsGrid.tsx",
                                            lineNumber: 105,
                                            columnNumber: 19
                                        }, this),
                                        isEPS && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowModal(true),
                                            className: "absolute top-2 right-2 text-[11px] px-2 py-1 rounded-full border border-blue-400 text-blue-400 bg-black bg-opacity-60 group-hover:opacity-100 opacity-0 transition",
                                            children: "View Chart"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/FinancialMetricsGrid.tsx",
                                            lineNumber: 110,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, idx, true, {
                                    fileName: "[project]/app/components/FinancialMetricsGrid.tsx",
                                    lineNumber: 100,
                                    columnNumber: 17
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/app/components/FinancialMetricsGrid.tsx",
                            lineNumber: 96,
                            columnNumber: 11
                        }, this)
                    ]
                }, groupIdx, true, {
                    fileName: "[project]/app/components/FinancialMetricsGrid.tsx",
                    lineNumber: 94,
                    columnNumber: 9
                }, this)),
            showModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$EPSChartModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                ticker: data.ticker,
                onClose: ()=>setShowModal(false)
            }, void 0, false, {
                fileName: "[project]/app/components/FinancialMetricsGrid.tsx",
                lineNumber: 125,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/FinancialMetricsGrid.tsx",
        lineNumber: 90,
        columnNumber: 5
    }, this);
}
_s(FinancialMetricsGrid, "uVlnG5KLfXemZk5i5Fl+Cg356FU=");
_c = FinancialMetricsGrid;
var _c;
__turbopack_context__.k.register(_c, "FinancialMetricsGrid");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/ExecutiveCard.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>ExecutiveCard)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function ExecutiveCard({ exec }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-zinc-900 border border-zinc-700 rounded-xl p-4 shadow-md hover:border-blue-400 transition",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-lg font-semibold text-white",
                children: exec.name
            }, void 0, false, {
                fileName: "[project]/app/components/ExecutiveCard.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-gray-400",
                children: exec.title
            }, void 0, false, {
                fileName: "[project]/app/components/ExecutiveCard.tsx",
                lineNumber: 11,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm mt-2 text-green-400 font-mono",
                children: exec.pay === "--" ? "Not Disclosed" : `$${exec.pay}`
            }, void 0, false, {
                fileName: "[project]/app/components/ExecutiveCard.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/ExecutiveCard.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
_c = ExecutiveCard;
var _c;
__turbopack_context__.k.register(_c, "ExecutiveCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/ExecutiveGrid.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>ExecutiveGrid)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExecutiveCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/ExecutiveCard.tsx [app-client] (ecmascript)");
;
;
function ExecutiveGrid({ execs }) {
    if (!execs || execs.length === 0) {
        console.log("❌ No execs to render"); // keep this for now
        return null;
    }
    console.log("✅ Rendering ExecutiveGrid with", execs.length, "execs");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "mt-16",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-2xl font-semibold text-blue-300 mb-4",
                children: " Executive Team"
            }, void 0, false, {
                fileName: "[project]/app/components/ExecutiveGrid.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4",
                children: execs.map((exec, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExecutiveCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        exec: exec
                    }, i, false, {
                        fileName: "[project]/app/components/ExecutiveGrid.tsx",
                        lineNumber: 22,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/components/ExecutiveGrid.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/ExecutiveGrid.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
_c = ExecutiveGrid;
var _c;
__turbopack_context__.k.register(_c, "ExecutiveGrid");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/summary/[ticker]/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>TickerPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SWOTCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/SWOTCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LoadingScreen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/LoadingScreen.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$StockChartToggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/StockChartToggle.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FinancialMetricsGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/FinancialMetricsGrid.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExecutiveGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/ExecutiveGrid.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
function formatAbbreviatedNumber(value) {
    if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
    return `$${value.toFixed(2)}`;
}
function formatAbbreviatedShares(value) {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toString();
}
function TickerPage() {
    _s();
    const { ticker } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [news, setNews] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [execs, setExecs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [peerData, setPeerData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [peerInsight, setPeerInsight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TickerPage.useEffect": ()=>{
            if (!ticker) return;
            const fetchData = {
                "TickerPage.useEffect.fetchData": async ()=>{
                    try {
                        const res = await fetch(`${("TURBOPACK compile-time value", "https://bullbrief-api.onrender.com")}/company/peers/insight/${ticker}`);
                        const json = await res.json();
                        setPeerInsight(json.insight || null);
                    } catch (err) {
                        console.error("Failed to fetch peer insight:", err);
                    }
                    try {
                        const res = await fetch(`${("TURBOPACK compile-time value", "https://bullbrief-api.onrender.com")}/summary/${ticker}`);
                        const json = await res.json();
                        if (res.ok) setData(json);
                        else setError(json.error || "Unknown error");
                    } catch (err) {
                        setError("Failed to fetch summary");
                    } finally{
                        setLoading(false);
                    }
                    try {
                        const res = await fetch(`${("TURBOPACK compile-time value", "https://bullbrief-api.onrender.com")}/news/${ticker}`);
                        const json = await res.json();
                        setNews(json.news || []);
                    } catch (err) {
                        console.error("Failed to fetch news:", err);
                    }
                    try {
                        const res = await fetch(`${("TURBOPACK compile-time value", "https://bullbrief-api.onrender.com")}/executives/${ticker}`);
                        const json = await res.json();
                        setExecs(json.executives || []);
                    } catch (err) {
                        console.error("Failed to fetch executives:", err);
                    }
                }
            }["TickerPage.useEffect.fetchData"];
            fetchData();
        }
    }["TickerPage.useEffect"], [
        ticker
    ]);
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LoadingScreen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        isLoading: loading
    }, void 0, false, {
        fileName: "[project]/app/summary/[ticker]/page.tsx",
        lineNumber: 117,
        columnNumber: 23
    }, this);
    if (error) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: "text-red-500 p-8 text-center",
        children: [
            "Error: ",
            error
        ]
    }, void 0, true, {
        fileName: "[project]/app/summary/[ticker]/page.tsx",
        lineNumber: 118,
        columnNumber: 21
    }, this);
    if (!data) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-black text-white px-6 md:px-16 py-24 font-sans space-y-16",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "inline-flex items-center text-sm text-blue-400 hover:text-blue-200 transition mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                className: "w-4 h-4 mr-2"
                            }, void 0, false, {
                                fileName: "[project]/app/summary/[ticker]/page.tsx",
                                lineNumber: 125,
                                columnNumber: 11
                            }, this),
                            "Back to Home"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/summary/[ticker]/page.tsx",
                        lineNumber: 124,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-4xl font-extrabold text-blue-400 tracking-tight",
                        children: [
                            data.company_name,
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-white",
                                children: [
                                    "(",
                                    data.ticker,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/summary/[ticker]/page.tsx",
                                lineNumber: 129,
                                columnNumber: 31
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/summary/[ticker]/page.tsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col md:flex-row md:items-center md:justify-between gap-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `text-sm px-3 py-1 rounded-full font-semibold ${data.pe_ratio > 100 ? "bg-red-600 text-white" : "bg-green-600 text-white"}`,
                            children: data.pe_ratio > 100 ? "Bearish Signal" : "Bullish Trend"
                        }, void 0, false, {
                            fileName: "[project]/app/summary/[ticker]/page.tsx",
                            lineNumber: 132,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/summary/[ticker]/page.tsx",
                        lineNumber: 131,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-sm text-gray-300 mt-6",
                        children: [
                            {
                                label: "Sector",
                                value: data.sector
                            },
                            {
                                label: "Market Cap",
                                value: formatAbbreviatedNumber(data.market_cap)
                            },
                            {
                                label: "P/E Ratio",
                                value: `${data.pe_ratio?.toFixed(1)}`
                            },
                            {
                                label: "EPS (TTM)",
                                value: `$${data.eps_ttm?.toFixed(2)}`
                            },
                            {
                                label: "52W Range",
                                value: data.range_52w
                            },
                            {
                                label: "Volume",
                                value: formatAbbreviatedShares(data.volume)
                            }
                        ].map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-zinc-900/70 backdrop-blur border border-zinc-700 px-4 py-3 rounded-xl shadow-sm flex flex-col",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-gray-400 font-medium",
                                        children: item.label
                                    }, void 0, false, {
                                        fileName: "[project]/app/summary/[ticker]/page.tsx",
                                        lineNumber: 146,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-white text-sm font-semibold",
                                        children: item.value
                                    }, void 0, false, {
                                        fileName: "[project]/app/summary/[ticker]/page.tsx",
                                        lineNumber: 147,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, i, true, {
                                fileName: "[project]/app/summary/[ticker]/page.tsx",
                                lineNumber: 145,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/summary/[ticker]/page.tsx",
                        lineNumber: 136,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/summary/[ticker]/page.tsx",
                lineNumber: 123,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-semibold text-blue-300 mb-4",
                        children: " Stock Performance"
                    }, void 0, false, {
                        fileName: "[project]/app/summary/[ticker]/page.tsx",
                        lineNumber: 154,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-xl border border-zinc-700 bg-zinc-900 p-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$StockChartToggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            symbol: data.exchange_symbol
                        }, void 0, false, {
                            fileName: "[project]/app/summary/[ticker]/page.tsx",
                            lineNumber: 156,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/summary/[ticker]/page.tsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/summary/[ticker]/page.tsx",
                lineNumber: 153,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-semibold text-blue-300 mb-4",
                        children: " Explore Metrics"
                    }, void 0, false, {
                        fileName: "[project]/app/summary/[ticker]/page.tsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-4 flex-wrap",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: `/summary/${ticker}/metric/revenue`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "bg-zinc-800 px-5 py-2 rounded-lg text-sm hover:bg-blue-600 transition text-white border border-zinc-700 shadow-sm",
                                    children: "Revenue"
                                }, void 0, false, {
                                    fileName: "[project]/app/summary/[ticker]/page.tsx",
                                    lineNumber: 164,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/summary/[ticker]/page.tsx",
                                lineNumber: 163,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: `/summary/${ticker}/metric/eps`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "bg-zinc-800 px-5 py-2 rounded-lg text-sm hover:bg-blue-600 transition text-white border border-zinc-700 shadow-sm",
                                    children: "EPS"
                                }, void 0, false, {
                                    fileName: "[project]/app/summary/[ticker]/page.tsx",
                                    lineNumber: 169,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/summary/[ticker]/page.tsx",
                                lineNumber: 168,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/summary/[ticker]/page.tsx",
                        lineNumber: 162,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/summary/[ticker]/page.tsx",
                lineNumber: 160,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-semibold text-blue-300 mb-4",
                        children: "The BullBrief"
                    }, void 0, false, {
                        fileName: "[project]/app/summary/[ticker]/page.tsx",
                        lineNumber: 177,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-zinc-900 border border-zinc-700 rounded-xl p-6 text-sm leading-relaxed text-gray-100 whitespace-pre-wrap",
                        children: data.business_summary
                    }, void 0, false, {
                        fileName: "[project]/app/summary/[ticker]/page.tsx",
                        lineNumber: 178,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/summary/[ticker]/page.tsx",
                lineNumber: 176,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SWOTCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                content: data.swot
            }, void 0, false, {
                fileName: "[project]/app/summary/[ticker]/page.tsx",
                lineNumber: 183,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-semibold text-blue-300 mb-4",
                        children: "Outlook"
                    }, void 0, false, {
                        fileName: "[project]/app/summary/[ticker]/page.tsx",
                        lineNumber: 186,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-zinc-900 border border-zinc-700 rounded-xl p-6 text-sm leading-relaxed text-gray-100 whitespace-pre-wrap",
                        children: data.outlook
                    }, void 0, false, {
                        fileName: "[project]/app/summary/[ticker]/page.tsx",
                        lineNumber: 187,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/summary/[ticker]/page.tsx",
                lineNumber: 185,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FinancialMetricsGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    data: data
                }, void 0, false, {
                    fileName: "[project]/app/summary/[ticker]/page.tsx",
                    lineNumber: 193,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/summary/[ticker]/page.tsx",
                lineNumber: 192,
                columnNumber: 7
            }, this),
            peerData && peerData.target && peerData.peers?.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-2xl font-semibold text-blue-300 mb-4",
                    children: "Peer Snapshot"
                }, void 0, false, {
                    fileName: "[project]/app/summary/[ticker]/page.tsx",
                    lineNumber: 197,
                    columnNumber: 5
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/summary/[ticker]/page.tsx",
                lineNumber: 196,
                columnNumber: 3
            }, this),
            peerInsight && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-semibold text-blue-300 mb-4",
                        children: "AI Peer Insight"
                    }, void 0, false, {
                        fileName: "[project]/app/summary/[ticker]/page.tsx",
                        lineNumber: 203,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-zinc-900 border border-zinc-700 rounded-xl p-6 text-sm leading-relaxed text-gray-100 whitespace-pre-wrap",
                        children: peerInsight
                    }, void 0, false, {
                        fileName: "[project]/app/summary/[ticker]/page.tsx",
                        lineNumber: 204,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/summary/[ticker]/page.tsx",
                lineNumber: 202,
                columnNumber: 3
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: execs.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExecutiveGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    execs: execs
                }, void 0, false, {
                    fileName: "[project]/app/summary/[ticker]/page.tsx",
                    lineNumber: 212,
                    columnNumber: 30
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/summary/[ticker]/page.tsx",
                lineNumber: 211,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-semibold text-blue-300 mb-4",
                        children: " Recent News"
                    }, void 0, false, {
                        fileName: "[project]/app/summary/[ticker]/page.tsx",
                        lineNumber: 217,
                        columnNumber: 9
                    }, this),
                    news.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-400 text-sm",
                        children: "No recent news found."
                    }, void 0, false, {
                        fileName: "[project]/app/summary/[ticker]/page.tsx",
                        lineNumber: 219,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-4",
                        children: news.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: item.link,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: "block bg-zinc-900 border border-zinc-700 rounded-lg p-4 hover:border-blue-400 transition",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-white font-semibold mb-1",
                                        children: item.title
                                    }, void 0, false, {
                                        fileName: "[project]/app/summary/[ticker]/page.tsx",
                                        lineNumber: 230,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-400",
                                        children: [
                                            item.publisher,
                                            " • ",
                                            new Date(item.providerPublishTime).toLocaleDateString()
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/summary/[ticker]/page.tsx",
                                        lineNumber: 231,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, idx, true, {
                                fileName: "[project]/app/summary/[ticker]/page.tsx",
                                lineNumber: 223,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/summary/[ticker]/page.tsx",
                        lineNumber: 221,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/summary/[ticker]/page.tsx",
                lineNumber: 216,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/summary/[ticker]/page.tsx",
        lineNumber: 122,
        columnNumber: 5
    }, this);
}
_s(TickerPage, "O+cANZNHuhOAvBjQEfaYQseAsdA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"]
    ];
});
_c = TickerPage;
var _c;
__turbopack_context__.k.register(_c, "TickerPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=app_bd409b19._.js.map