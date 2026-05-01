export type LegalSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type LegalDocument = {
  title: string;
  eyebrow: string;
  updated: string;
  intro: string[];
  sections: LegalSection[];
};

export const LEGAL_UPDATED = "May 1, 2026";

const advancedTermsSections: LegalSection[] = [
  {
    title: "25. Regulatory Character of the Service",
    paragraphs: [
      "BullBrief is structured as a general-purpose financial research publication and software tool. It is not structured as an individualized advisory service. The service is intended to present generally available information, AI-assisted explanations, and research workflows to users who remain responsible for evaluating the information independently.",
      "BullBrief does not undertake to monitor your portfolio, rebalance your holdings, supervise your trading, provide continuing advice, manage assets, determine suitability, or update you when a prior output changes because of new facts. BullBrief does not accept discretionary authority over any account.",
      "The fact that BullBrief discusses securities, issuers, valuation metrics, market prices, business risks, or analyst-style concepts does not mean BullBrief is acting as your investment adviser, broker, fiduciary, financial planner, or investment committee.",
    ],
    bullets: [
      "BullBrief does not provide a Form ADV, Form CRS, account agreement, advisory contract, brokerage account agreement, discretionary management agreement, wrap-fee program brochure, or fiduciary undertaking.",
      "BullBrief does not recommend account types, broker-dealers, custodians, exchanges, advisers, funds, managers, insurance products, retirement plans, or tax elections.",
      "BullBrief does not evaluate whether any transaction would be in your best interest, suitable for you, consistent with your objectives, or permitted under your laws, policies, plan documents, or employer restrictions.",
    ],
  },
  {
    title: "26. No Recommendation, Solicitation, or Offer",
    paragraphs: [
      "BullBrief content is not an offer to sell, solicitation of an offer to buy, solicitation of an offer to sell, tender offer, proxy solicitation, research report prepared by a broker-dealer, underwriting communication, roadshow, prospectus, private placement memorandum, investment company prospectus, commodity pool disclosure document, or other regulated offering document.",
      "BullBrief does not sponsor, promote, underwrite, distribute, place, make a market in, or solicit transactions in securities. BullBrief does not receive order flow, execute orders, clear trades, settle trades, or participate in trade confirmations.",
      "If BullBrief displays a ticker, company, ETF, market index, security, peer group, chart, signal, score, output, or comparison, that display is not a call to action and is not a solicitation directed at you.",
    ],
  },
  {
    title: "27. No Suitability, Best Interest, or Fiduciary Determination",
    paragraphs: [
      "BullBrief does not perform suitability analysis, best-interest analysis, fiduciary analysis, investment policy statement analysis, risk-capacity analysis, risk-tolerance analysis, portfolio construction analysis, concentration analysis, tax-loss harvesting analysis, retirement income analysis, estate planning analysis, or financial planning analysis.",
      "Any user interface element that ranks, colors, scores, labels, highlights, summarizes, compares, or visualizes an issuer is not a determination that a transaction is suitable, prudent, advisable, or in any person's best interest.",
      "You acknowledge that a lawful and prudent investment decision may require information BullBrief does not have and analysis BullBrief does not perform.",
    ],
  },
  {
    title: "28. Impersonal Publication and Research Tool",
    paragraphs: [
      "BullBrief outputs are intended to be general and impersonal. Search results are based on user-entered ticker symbols or company names and general market data, not on a full advisory profile of the user. BullBrief does not create a customized financial plan by asking for and analyzing your complete personal circumstances.",
      "BullBrief may generate text in response to a ticker-specific request, but ticker-specific research is not the same as personalized advice. A user can request information about any public company for educational reasons, academic reasons, curiosity, comparison, news understanding, or independent research. BullBrief does not infer that the user owns, should own, should sell, or should buy that security.",
      "The service should be understood as an informational interface, not a professional judgment replacing a licensed adviser, attorney, accountant, or tax professional.",
    ],
  },
  {
    title: "29. Material Nonpublic Information and Insider Trading",
    paragraphs: [
      "You must not submit, request, upload, process, or attempt to use material nonpublic information through BullBrief. You must not use BullBrief to analyze or trade on information you are prohibited from using.",
      "You are solely responsible for complying with insider trading laws, confidentiality duties, employment policies, trading windows, blackout periods, pre-clearance requirements, lock-up restrictions, restricted list obligations, watch list obligations, and any other legal or contractual trading restrictions that apply to you.",
    ],
    bullets: [
      "Do not enter confidential company information into BullBrief.",
      "Do not ask BullBrief to interpret information you know or suspect is material and nonpublic.",
      "Do not use BullBrief to evade compliance controls or professional obligations.",
    ],
  },
  {
    title: "30. Professional and Enterprise Use",
    paragraphs: [
      "If you are an investment professional, broker-dealer representative, investment adviser representative, research analyst, portfolio manager, attorney, accountant, journalist, issuer employee, public company officer, compliance professional, educator, or other professional user, you are solely responsible for determining whether and how you may use BullBrief under the rules that apply to you.",
      "Professional users must not rely on BullBrief to satisfy supervisory obligations, recordkeeping obligations, advertising review, research analyst rules, marketing rules, fiduciary obligations, best execution obligations, suitability obligations, know-your-customer obligations, or compliance policies.",
      "Enterprise or professional use may require separate terms, data licenses, audits, security review, compliance review, and written permission.",
    ],
  },
  {
    title: "31. Financial Promotion and Redistribution Controls",
    paragraphs: [
      "You must not copy BullBrief outputs into advertisements, paid newsletters, social posts, investor decks, pitch materials, paid groups, trading rooms, marketing funnels, issuer promotions, fund marketing, or advisory communications in a way that makes the output misleading, unbalanced, promotional, or inconsistent with these Terms.",
      "If you quote, summarize, screenshot, or redistribute BullBrief content, you are responsible for preserving context, including the non-advice disclaimer, data limitations, AI limitations, and date of generation where relevant.",
    ],
  },
  {
    title: "32. No Reliance for Regulated Decisions",
    paragraphs: [
      "BullBrief must not be used as the sole basis for regulated, mission-critical, or legally consequential decisions. This includes investment execution, credit decisions, insurance underwriting, employment decisions, regulatory filings, public disclosures, tax filings, audit workpapers, legal opinions, compliance certifications, fiduciary minutes, investment committee approvals, or board materials.",
      "Any person using BullBrief in a professional context must independently verify all information and apply appropriate human review.",
    ],
  },
  {
    title: "33. Open-Source, Beta, and Development Status",
    paragraphs: [
      "BullBrief may be early-stage software. Certain pages, features, integrations, data routes, AI prompts, model choices, chart components, and provider connections may be experimental. Experimental software may fail in ordinary use.",
      "No development roadmap, feature description, screenshot, demo, commit, issue, branch, or future plan creates a binding obligation to ship or maintain any feature.",
    ],
  },
  {
    title: "34. Severability, Waiver, Assignment, and Entire Agreement",
    paragraphs: [
      "If any provision of these Terms is found unenforceable, the remaining provisions will remain in effect to the fullest extent permitted by law, and the unenforceable provision will be modified to the minimum extent necessary to make it enforceable if permitted.",
      "BullBrief's failure to enforce a provision is not a waiver. You may not assign or transfer these Terms without BullBrief's consent. BullBrief may assign these Terms in connection with a merger, acquisition, financing, restructuring, asset sale, or operation of law.",
      "These Terms, together with the Disclaimer, Privacy Policy, and any additional terms presented for specific features, form the entire agreement between you and BullBrief regarding the service.",
    ],
  },
];

const advancedDisclaimerSections: LegalSection[] = [
  {
    title: "16. Recommendation Analysis Framework",
    paragraphs: [
      "BullBrief intentionally avoids taking discretionary control, opening accounts, routing orders, collecting portfolio profiles for suitability, or telling a user to transact. Nevertheless, users should understand that financial language can be misread as advice. This section explains how to read BullBrief outputs.",
      "A BullBrief output may describe an issuer as attractive, risky, expensive, cheap, improving, deteriorating, high quality, low quality, bullish, bearish, or watchlist-worthy. Those descriptors are research shorthand. They are not individualized recommendations and are not a conclusion that a transaction should occur.",
      "A user may decide independently to trade after reading BullBrief. That independent decision is the user's responsibility, not BullBrief's instruction.",
    ],
  },
  {
    title: "17. Context That BullBrief Does Not Know",
    paragraphs: [
      "BullBrief does not know whether you are an accredited investor, qualified client, qualified purchaser, fiduciary, trustee, plan sponsor, insider, control person, employee subject to trading windows, officer, director, broker-dealer employee, investment adviser employee, public official, non-U.S. person, restricted person, or person subject to special rules.",
      "BullBrief does not know your cost basis, unrealized gains, unrealized losses, tax bracket, wash-sale history, margin level, option approval level, retirement plan rules, employer stock exposure, cash needs, debt obligations, insurance needs, estate plan, dependents, disability status, or risk capacity.",
      "Because BullBrief lacks this context, it cannot determine what is prudent, suitable, lawful, tax-efficient, or advisable for you.",
    ],
  },
  {
    title: "18. AI Model Governance and Human Review",
    paragraphs: [
      "AI outputs should be treated as machine-generated drafts. The output may be useful for orientation, but it is not a professional opinion. Users should perform human review before using an output for any consequential purpose.",
      "Appropriate human review may include checking the issuer's latest Form 10-K, Form 10-Q, Form 8-K, earnings release, investor presentation, conference call transcript, proxy statement, debt disclosures, risk factors, and official investor relations materials.",
      "If an output appears unusually certain, unusually promotional, unusually negative, internally inconsistent, unsupported by data, or inconsistent with primary sources, treat that as a warning sign.",
    ],
  },
  {
    title: "19. Public Company Disclosure Risk",
    paragraphs: [
      "Public company information can be complex. A simple chart or summary can hide important details such as revenue recognition, deferred revenue, customer concentration, supplier concentration, goodwill impairment, restructuring charges, stock-based compensation, related-party transactions, debt covenants, off-balance-sheet obligations, legal contingencies, tax reserves, and non-GAAP reconciliations.",
      "BullBrief summaries may not capture every material disclosure. A risk factor may be boilerplate or may be genuinely important. A one-time item may or may not be economically meaningful. A non-GAAP adjustment may or may not be reasonable. These judgments require careful review.",
    ],
  },
  {
    title: "20. Trading Mechanics and Execution Risk",
    paragraphs: [
      "BullBrief does not address order types, spreads, liquidity, market impact, slippage, partial fills, halts, limit up-limit down rules, extended-hours trading, options assignment, exercise risk, short borrow availability, margin maintenance, pattern day trader rules, settlement, or brokerage-specific restrictions.",
      "Even accurate research can lead to poor results if execution is poor, if liquidity is thin, if timing is bad, or if a user misunderstands the product being traded.",
    ],
  },
  {
    title: "21. Regulatory Reference Points",
    paragraphs: [
      "Official investor education resources explain that investment advisers generally provide investment advice for compensation and that retail investors should check whether professionals are registered. BullBrief's disclosure posture is designed around the distinction between general information and personalized professional advice.",
      "The SEC's Regulation Best Interest framework addresses broker-dealer recommendations to retail customers, and FINRA materials discuss the importance of understanding registered professionals. BullBrief is not a broker-dealer and does not make retail customer recommendations.",
      "Regulators have also warned investors about AI-related investment fraud. BullBrief's AI disclosures are designed to remind users that AI-generated text is not proof, advice, or a guarantee.",
    ],
    bullets: [
      "Investor.gov investment adviser information: https://www.investor.gov/index.php/introduction-investing/getting-started/working-investment-professional/investment-advisers",
      "FINRA investment adviser education: https://www.finra.org/investors/investing/working-with-investment-professional/investment-advisers",
      "SEC Regulation Best Interest resources: https://www.sec.gov/regulation-best-interest",
      "FINRA AI investment fraud warning: https://www.finra.org/investors/insights/artificial-intelligence-and-investment-fraud",
    ],
  },
  {
    title: "22. No Safe Harbor for User Misuse",
    paragraphs: [
      "These disclaimers protect the informational character of BullBrief; they do not authorize users to misuse the service. A user cannot use BullBrief to create unlawful recommendations, misleading promotions, market manipulation, or unregistered advisory activity and then claim BullBrief is responsible.",
      "If you are unsure whether your use is lawful, consult qualified counsel before using or redistributing BullBrief outputs.",
    ],
  },
];

const advancedPrivacySections: LegalSection[] = [
  {
    title: "16. Sensitive Financial Information Warning",
    paragraphs: [
      "BullBrief is not designed to receive or store sensitive financial account information. Users should not enter brokerage credentials, account numbers, routing numbers, tax IDs, Social Security numbers, full dates of birth, private keys, seed phrases, passwords, account balances, position files, trade confirmations, bank statements, tax returns, or employer-restricted information.",
      "If you voluntarily provide sensitive information in a prompt, support request, or feedback message, BullBrief may not be able to prevent that information from being processed by infrastructure, logging, security, or AI providers. Do not submit sensitive information unless BullBrief expressly provides a secure workflow for that purpose.",
    ],
  },
  {
    title: "17. AI Prompt and Output Handling",
    paragraphs: [
      "Prompts and outputs may include ticker symbols, company names, financial data, comparison lists, AI-generated text, and usage metadata. BullBrief may process this information to provide requested features, debug failures, prevent abuse, improve prompts, and reduce duplicate calls.",
      "BullBrief may use session storage or in-memory caches in the browser so the same tab does not repeatedly call AI or market-data endpoints. This is intended to reduce cost, latency, and unnecessary provider requests.",
    ],
  },
  {
    title: "18. Legal Bases and Legitimate Interests",
    paragraphs: [
      "Where privacy laws require a legal basis, BullBrief may process information to perform the service requested by the user, pursue legitimate interests such as security and product improvement, comply with legal obligations, protect rights and safety, and process information with consent where required.",
      "Legitimate interests may include fraud prevention, abuse monitoring, service analytics, debugging, system reliability, model-output quality review, and enforcement of Terms.",
    ],
  },
  {
    title: "19. U.S. State Privacy Disclosures",
    paragraphs: [
      "Depending on your state, you may have rights to know, access, correct, delete, obtain a copy of, or opt out of certain processing of personal information. BullBrief will honor applicable rights where legally required.",
      "BullBrief does not intend to sell sensitive personal financial information. If BullBrief later uses advertising or analytics practices that qualify as sale, sharing, or targeted advertising under applicable law, BullBrief should provide any required notices or opt-out mechanisms.",
    ],
  },
  {
    title: "20. European and International Privacy Disclosures",
    paragraphs: [
      "If you are located in a jurisdiction with GDPR-style privacy rights, you may have rights to access, rectification, erasure, restriction, portability, objection, and complaint to a supervisory authority, subject to limitations and verification.",
      "BullBrief may transfer information to countries that may not provide the same level of data protection as your home jurisdiction. Where required, BullBrief should rely on appropriate transfer mechanisms or service-provider terms.",
    ],
  },
  {
    title: "21. Security Limitations and User Conduct",
    paragraphs: [
      "Security is shared. BullBrief can use reasonable safeguards, but users must avoid submitting secrets, must secure their devices, must use trusted networks, must protect browser sessions, and must avoid sharing screenshots or outputs that reveal sensitive research interests or personal information.",
      "No online service can guarantee perfect security. Logs, backups, provider systems, browser extensions, malware, compromised devices, and user sharing can create privacy risks.",
    ],
  },
];

export const termsContent: LegalDocument = {
  title: "Terms of Service",
  eyebrow: "Legal Terms",
  updated: LEGAL_UPDATED,
  intro: [
    "These Terms of Service govern access to and use of BullBrief, including the website, pages, tools, AI-generated summaries, market data displays, comparison tools, analyst-style reports, educational glossary content, and any related services that link to these Terms.",
    "BullBrief is an informational research interface. BullBrief is not a broker, dealer, exchange, investment adviser, registered investment adviser, financial planner, tax adviser, legal adviser, accounting adviser, custodian, transfer agent, clearing firm, bank, or fiduciary. BullBrief does not provide personalized investment advice, does not recommend that any person buy, sell, hold, short, trade, hedge, or avoid any security, and does not place or route orders.",
    "By using BullBrief, you agree to these Terms. If you do not agree, do not use BullBrief.",
  ],
  sections: [
    {
      title: "1. Plain English Summary",
      paragraphs: [
        "This summary is provided only for convenience. The full Terms control if there is any conflict.",
        "BullBrief gives you research-style information, AI-generated explanations, charts, market summaries, data visualizations, and educational content. You are responsible for your own decisions. You should not treat anything on BullBrief as a recommendation, instruction, guarantee, endorsement, personalized strategy, financial plan, or promise of future results.",
      ],
      bullets: [
        "BullBrief is not investment advice.",
        "BullBrief is not personalized to your finances, goals, risk tolerance, tax position, time horizon, liquidity needs, or legal restrictions.",
        "BullBrief may be wrong, stale, incomplete, delayed, or generated from incorrect third-party data.",
        "You should verify important information independently before relying on it.",
        "You should consult qualified professionals before making financial, legal, tax, or accounting decisions.",
      ],
    },
    {
      title: "2. Eligibility",
      paragraphs: [
        "You may use BullBrief only if you are legally able to enter into a binding agreement and only in compliance with applicable law. If you use BullBrief on behalf of an organization, you represent that you have authority to bind that organization to these Terms.",
        "BullBrief is intended for users who can understand the risks of financial information, securities markets, AI-generated content, and online research tools. BullBrief is not directed to children.",
      ],
      bullets: [
        "You must not use BullBrief if your use would violate any law, regulation, court order, sanctions restriction, platform rule, data-provider rule, or contractual obligation.",
        "You must not use BullBrief for or on behalf of another person if doing so requires a license, registration, approval, or professional qualification you do not have.",
        "You must not use BullBrief to provide individualized advice to another person unless you are solely responsible for complying with all applicable professional and regulatory requirements.",
      ],
    },
    {
      title: "3. No Investment Advice",
      paragraphs: [
        "BullBrief content is provided for general informational and educational purposes only. BullBrief does not provide investment advice, financial advice, trading advice, tax advice, legal advice, accounting advice, retirement advice, estate planning advice, or any other regulated professional advice.",
        "No BullBrief output is a recommendation to buy, sell, hold, short, hedge, allocate to, avoid, overweight, underweight, or otherwise transact in any security, company, ETF, fund, option, derivative, digital asset, commodity, currency, index, strategy, or other financial instrument.",
        "BullBrief does not know your complete financial situation. BullBrief does not evaluate your investment objectives, risk tolerance, age, income, net worth, liquidity needs, tax consequences, portfolio concentration, debt obligations, employment situation, legal restrictions, investment horizon, or psychological ability to tolerate losses.",
      ],
      bullets: [
        "Do not treat AI summaries as personal advice.",
        "Do not treat ratings, scores, labels, signals, bullish or bearish language, charts, comparisons, or examples as instructions.",
        "Do not make trades solely because BullBrief displayed a metric, summary, chart, signal, or AI report.",
        "Do not assume that a company discussed positively is suitable for you.",
        "Do not assume that a company discussed negatively should be sold, shorted, avoided, or ignored.",
      ],
    },
    {
      title: "4. No Adviser, Broker, Fiduciary, or Client Relationship",
      paragraphs: [
        "Your use of BullBrief does not create an adviser-client relationship, broker-client relationship, fiduciary relationship, attorney-client relationship, accountant-client relationship, tax preparer-client relationship, agency relationship, partnership, joint venture, employment relationship, or any other professional relationship.",
        "BullBrief is not registered as an investment adviser, broker-dealer, securities exchange, alternative trading system, commodity trading advisor, commodity pool operator, municipal advisor, transfer agent, clearing agency, bank, insurer, or similar regulated financial institution.",
        "BullBrief does not custody assets, accept deposits, hold securities, execute trades, transmit orders, recommend brokerages, match counterparties, provide margin, provide credit, or offer portfolio management.",
      ],
    },
    {
      title: "5. AI-Generated Content",
      paragraphs: [
        "BullBrief uses automated systems and AI models to generate explanations, summaries, comparisons, reports, labels, and other outputs. AI-generated content can be inaccurate, incomplete, biased, stale, misleading, internally inconsistent, or based on incorrect assumptions.",
        "AI systems may produce confident language even when the underlying output is wrong. AI systems may omit important risk factors, misunderstand financial statements, overstate correlations, understate uncertainty, rely on stale data, misread company filings, or generate text that sounds more certain than the evidence supports.",
        "You are responsible for reviewing, validating, and independently confirming all AI-generated content before using it for any purpose.",
      ],
      bullets: [
        "AI output is not reviewed by a licensed investment professional unless BullBrief expressly says otherwise for a specific item.",
        "AI output may not reflect the latest earnings release, SEC filing, press release, market event, macro event, legal event, product launch, management change, restatement, merger, dividend action, guidance change, analyst action, or regulatory development.",
        "AI output may summarize third-party data incorrectly.",
        "AI output may use language like bullish, bearish, opportunity, risk, driver, catalyst, rating, score, or target as descriptive research language only. Such language is not a directive.",
      ],
    },
    {
      title: "6. Data Sources and Third-Party Information",
      paragraphs: [
        "BullBrief may use market data, company data, fundamental data, SEC filing data, news data, AI providers, charting providers, quote providers, financial APIs, public websites, user-entered symbols, and other third-party or public sources. BullBrief does not control all of these sources.",
        "Data may be delayed, estimated, adjusted, restated, missing, misclassified, limited by provider terms, or unavailable. Historical figures may be revised. Financial metrics may be calculated differently by different providers. Symbols may map incorrectly. Company names, ticker symbols, sectors, exchanges, peer groups, and executive information may be incomplete or stale.",
        "You agree that BullBrief is not liable for errors, delays, outages, limitations, or omissions in third-party data or third-party services.",
      ],
      bullets: [
        "Always confirm critical information with primary sources, such as SEC filings, issuer investor relations materials, official exchange data, and your brokerage.",
        "Do not rely on BullBrief as your only source of truth.",
        "Do not rely on BullBrief for real-time trading, order timing, execution decisions, stop-loss decisions, margin calls, tax reporting, compliance reporting, or legally required disclosures.",
      ],
    },
    {
      title: "7. Market Risk and No Performance Guarantee",
      paragraphs: [
        "Investing and trading involve risk. You can lose money, including your entire investment. Securities prices can move rapidly and unpredictably. Past performance does not guarantee future results. Historical data does not guarantee future returns. Backtests, charts, analyst-style summaries, AI predictions, and metric trends are not guarantees.",
        "BullBrief does not promise that any information, analysis, model, chart, data point, forecast, comparison, score, or output will be profitable, accurate, timely, or suitable for any person.",
      ],
      bullets: [
        "Individual stocks can decline sharply or become worthless.",
        "ETFs and funds can lose value and may contain concentration, liquidity, tracking, fee, leverage, or counterparty risks.",
        "Options, margin, short selling, leveraged products, inverse products, futures, crypto assets, and complex strategies can create losses larger than expected.",
        "Markets can be affected by interest rates, inflation, earnings, liquidity, geopolitics, regulatory changes, fraud, accounting issues, cybersecurity events, management conduct, and sudden sentiment shifts.",
      ],
    },
    {
      title: "8. User Responsibilities",
      paragraphs: [
        "You are solely responsible for how you use BullBrief and for all decisions you make after using BullBrief. You are responsible for evaluating whether information is accurate, complete, current, suitable, lawful, and appropriate for your circumstances.",
        "You agree to use sound judgment, to verify important information independently, and to consult qualified professionals when appropriate.",
      ],
      bullets: [
        "You are responsible for your trades, investments, portfolio decisions, tax filings, legal compliance, and financial outcomes.",
        "You are responsible for maintaining your own records.",
        "You are responsible for understanding the terms and risks of any brokerage, exchange, product, security, strategy, or financial instrument you use.",
        "You are responsible for complying with all laws that apply to you.",
      ],
    },
    {
      title: "9. Prohibited Uses",
      paragraphs: [
        "You must not misuse BullBrief. You must not use BullBrief in a way that harms the service, other users, data providers, markets, issuers, or any third party.",
      ],
      bullets: [
        "Do not use BullBrief to commit fraud, market manipulation, insider trading, spoofing, pump-and-dump activity, scalping, front-running, wash trading, deceptive promotion, harassment, or unlawful solicitation.",
        "Do not use BullBrief to create or distribute misleading financial promotions.",
        "Do not use BullBrief to imply that BullBrief endorses, recommends, sponsors, or approves any security, strategy, product, newsletter, influencer account, paid group, trading room, fund, adviser, or broker.",
        "Do not scrape, crawl, bulk download, reverse engineer, copy, resell, sublicense, redistribute, or commercially exploit BullBrief or its data unless BullBrief gives written permission.",
        "Do not bypass access controls, rate limits, robots rules, security controls, authentication systems, or technical restrictions.",
        "Do not upload malware, spam, abusive content, unlawful content, or content that violates third-party rights.",
      ],
    },
    {
      title: "10. Accounts and Security",
      paragraphs: [
        "If BullBrief offers accounts, you must provide accurate information and protect your login credentials. You are responsible for all activity under your account unless applicable law says otherwise.",
        "You must promptly notify BullBrief if you suspect unauthorized access. BullBrief may suspend or terminate accounts to protect users, protect the service, comply with law, or investigate misuse.",
      ],
    },
    {
      title: "11. User Content and User Inputs",
      paragraphs: [
        "You may enter ticker symbols, company names, comparison lists, prompts, notes, comments, or other inputs. You are responsible for your inputs and for ensuring you have the right to submit them.",
        "Do not submit confidential, regulated, personal, proprietary, account, brokerage, tax, legal, medical, employment, or inside information. Do not submit information that would violate a confidentiality duty, employment duty, fiduciary duty, securities law, court order, or contract.",
        "You grant BullBrief a non-exclusive, worldwide, royalty-free license to process your inputs as necessary to operate, secure, improve, and provide the service.",
      ],
    },
    {
      title: "12. Intellectual Property",
      paragraphs: [
        "BullBrief, including its design, code, text, branding, workflows, charts, interfaces, icons, layout, and original content, is owned by BullBrief or its licensors and is protected by intellectual property laws.",
        "Subject to these Terms, BullBrief grants you a limited, revocable, non-exclusive, non-transferable license to use the service for your own lawful, personal, educational, or internal research purposes.",
      ],
      bullets: [
        "You may not remove copyright, trademark, attribution, or proprietary notices.",
        "You may not copy the service to create a competing product.",
        "You may not use BullBrief branding in a way that suggests endorsement or affiliation without written permission.",
      ],
    },
    {
      title: "13. Feedback",
      paragraphs: [
        "If you provide ideas, suggestions, bug reports, feature requests, or other feedback, BullBrief may use that feedback without restriction or compensation to you. You agree that feedback is not confidential unless BullBrief separately agrees in writing.",
      ],
    },
    {
      title: "14. Fees, Trials, and Paid Features",
      paragraphs: [
        "If BullBrief offers paid features, pricing, billing periods, renewal terms, refund rules, usage limits, and cancellation terms will be presented at or before purchase. Taxes may apply. Paid features do not transform BullBrief into investment advice.",
        "Even if you pay for BullBrief, the service remains informational and educational. Payment for access is not payment for personalized investment advice, portfolio management, fiduciary services, brokerage services, tax advice, legal advice, or accounting advice.",
      ],
    },
    {
      title: "15. Availability and Changes",
      paragraphs: [
        "BullBrief may change, suspend, discontinue, limit, or remove any feature, data source, route, content type, model, provider, chart, page, or tool at any time. BullBrief may impose usage limits or access restrictions.",
        "BullBrief may be unavailable because of maintenance, bugs, third-party outages, network issues, provider limits, security events, market data restrictions, or other causes.",
      ],
    },
    {
      title: "16. Beta and Experimental Features",
      paragraphs: [
        "Some BullBrief features may be experimental, incomplete, in beta, or provided for testing. Experimental features may change quickly, produce unexpected outputs, fail, or be removed without notice.",
        "You should not rely on beta features for important decisions.",
      ],
    },
    {
      title: "17. Third-Party Links and Services",
      paragraphs: [
        "BullBrief may link to third-party websites, APIs, brokerages, market data providers, AI providers, public filings, news articles, investor relations pages, social platforms, or other services. Third-party services are governed by their own terms and policies.",
        "BullBrief does not control third-party services and is not responsible for their content, accuracy, availability, security, privacy practices, fees, or conduct.",
      ],
    },
    {
      title: "18. Disclaimers of Warranties",
      paragraphs: [
        "BullBrief is provided on an as-is and as-available basis. To the fullest extent permitted by law, BullBrief disclaims all warranties, express, implied, statutory, or otherwise, including warranties of accuracy, completeness, timeliness, reliability, availability, merchantability, fitness for a particular purpose, title, non-infringement, and quiet enjoyment.",
        "BullBrief does not warrant that the service will be uninterrupted, secure, error-free, free from harmful components, or that outputs will be correct, complete, timely, or suitable for any purpose.",
      ],
    },
    {
      title: "19. Limitation of Liability",
      paragraphs: [
        "To the fullest extent permitted by law, BullBrief and its owners, operators, contributors, affiliates, vendors, licensors, and service providers will not be liable for indirect, incidental, consequential, special, exemplary, punitive, or enhanced damages, lost profits, lost revenue, lost savings, lost data, trading losses, investment losses, opportunity costs, reputational harm, business interruption, or loss of goodwill.",
        "This limitation applies whether a claim is based on contract, tort, negligence, strict liability, warranty, statute, or any other theory, even if BullBrief has been advised of the possibility of damages.",
      ],
    },
    {
      title: "20. Indemnification",
      paragraphs: [
        "You agree to defend, indemnify, and hold harmless BullBrief and its owners, operators, contributors, affiliates, vendors, licensors, and service providers from claims, liabilities, damages, losses, costs, and expenses, including reasonable attorneys' fees, arising from your use of BullBrief, your violation of these Terms, your violation of law, your misuse of data, your user inputs, your trading or investment activity, or your infringement of third-party rights.",
      ],
    },
    {
      title: "21. Termination",
      paragraphs: [
        "BullBrief may suspend or terminate access at any time if BullBrief believes you violated these Terms, created risk, caused harm, misused the service, or if access is no longer commercially, legally, technically, or operationally practical.",
        "You may stop using BullBrief at any time. Sections that by their nature should survive termination will survive, including disclaimers, limitations of liability, intellectual property provisions, indemnity obligations, and dispute terms.",
      ],
    },
    {
      title: "22. Governing Law and Disputes",
      paragraphs: [
        "These Terms are governed by applicable United States law and, to the fullest extent permitted, the laws of the state in which BullBrief's operator is organized or primarily located, without regard to conflict-of-law rules. If BullBrief later publishes a more specific governing law or venue, that published designation will apply prospectively to the fullest extent permitted by law.",
        "Before bringing a formal claim, you agree to try to resolve disputes informally by contacting BullBrief. Nothing in this section limits either party's ability to seek emergency equitable relief or to comply with government, regulatory, or law enforcement requests.",
      ],
    },
    {
      title: "23. Changes to These Terms",
      paragraphs: [
        "BullBrief may update these Terms from time to time. The updated date will identify the latest version. Continued use after changes become effective means you accept the updated Terms.",
        "If a change is material, BullBrief may provide additional notice when practical. It is your responsibility to review the Terms periodically.",
      ],
    },
    {
      title: "24. Contact",
      paragraphs: [
        "Questions about these Terms may be directed through the contact method provided by BullBrief. Do not send confidential investment, brokerage, tax, legal, medical, employment, or account information through general contact channels.",
      ],
    },
    ...advancedTermsSections,
  ],
};

export const disclaimerContent: LegalDocument = {
  title: "Investment, AI, and Research Disclaimer",
  eyebrow: "Required Disclosures",
  updated: LEGAL_UPDATED,
  intro: [
    "This Disclaimer is intentionally detailed because BullBrief discusses public companies, securities, market data, financial metrics, AI-generated summaries, and analyst-style research. The core rule is simple: BullBrief is not investment advice.",
    "Nothing on BullBrief should be treated as a recommendation, personalized financial advice, trading advice, legal advice, tax advice, accounting advice, fiduciary guidance, or a promise that any outcome will occur.",
  ],
  sections: [
    {
      title: "1. Not Investment Advice",
      paragraphs: [
        "BullBrief is for education, research organization, and general information only. BullBrief does not recommend securities or strategies. BullBrief does not tell you what to buy, sell, hold, short, hedge, allocate, avoid, or trade.",
        "Any phrase that sounds directional, including bullish, bearish, signal, opportunity, risk, catalyst, driver, rating, score, target, valuation, undervalued, overvalued, attractive, expensive, outperform, underperform, buy zone, downside, upside, or watch item, is descriptive research language only. It is not personal advice and it is not an instruction.",
      ],
      bullets: [
        "You should not make an investment decision based only on BullBrief.",
        "You should not use BullBrief as a substitute for a licensed professional who understands your situation.",
        "You should not assume BullBrief knows what is suitable for you.",
        "You should not assume any output is complete, current, or correct.",
      ],
    },
    {
      title: "2. No Personalization",
      paragraphs: [
        "BullBrief does not collect enough information to determine suitability. Even if BullBrief lets you search a ticker, compare companies, generate a report, or view a score, BullBrief does not know your full financial life.",
        "A security that appears reasonable in a general research context may be completely inappropriate for a particular person because of risk tolerance, time horizon, concentration, taxes, employment exposure, debt, family obligations, liquidity needs, age, income, net worth, jurisdiction, or legal restrictions.",
      ],
    },
    {
      title: "3. No Registration Status",
      paragraphs: [
        "BullBrief is not registered with the SEC, FINRA, any state securities regulator, the CFTC, the NFA, any insurance regulator, any banking regulator, or any similar authority as an investment adviser, broker-dealer, commodity trading advisor, commodity pool operator, financial planner, bank, exchange, or fiduciary.",
        "Regulators explain that an investment adviser generally involves being in the business of providing securities advice for compensation. BullBrief is designed as an informational tool and not as a personalized advisory relationship.",
      ],
      bullets: [
        "If you want investment advice, consider working with an appropriately registered professional.",
        "You can research investment professionals through official investor resources such as Investor.gov and FINRA BrokerCheck.",
        "Registration status, conflicts, fees, disciplinary history, and scope of services matter.",
      ],
    },
    {
      title: "4. AI Limitations",
      paragraphs: [
        "AI-generated financial content is risky when users over-trust it. BullBrief outputs may be produced by large language models or other automated systems. These systems can hallucinate, generalize from weak evidence, omit material facts, misunderstand filings, mislabel metrics, misread news, or produce confident text that is not justified.",
        "AI may produce summaries that sound like professional research even when the output is incomplete. You must treat AI content as a starting point for your own review, not as a final answer.",
      ],
      bullets: [
        "AI may be wrong about revenue, EPS, margins, valuation, executives, peer groups, business segments, risks, catalysts, guidance, and filing details.",
        "AI may not know about recent events.",
        "AI may mix old data with new data.",
        "AI may fail to recognize restatements, one-time items, non-GAAP adjustments, share splits, mergers, spin-offs, delistings, ticker changes, or accounting policy changes.",
      ],
    },
    {
      title: "5. Market Data Limitations",
      paragraphs: [
        "BullBrief may display prices, charts, volume, market cap, ratios, financial statements, SEC filing information, analyst-style interpretations, peer comparisons, news, and other market-related information. This information may come from third parties and public sources.",
        "Market data can be delayed, inaccurate, incomplete, unavailable, misadjusted, or affected by provider outages. Financial data can differ between providers because of calculation methods, restatements, fiscal calendars, non-GAAP adjustments, share-count methods, currency conversions, and missing values.",
      ],
      bullets: [
        "Do not use BullBrief for real-time trading decisions.",
        "Do not use BullBrief as the source for order entry.",
        "Do not use BullBrief as the official record for tax, accounting, legal, audit, compliance, or regulatory purposes.",
        "Always verify critical data with primary sources.",
      ],
    },
    {
      title: "6. SEC Filings and Company Materials",
      paragraphs: [
        "SEC filings, company reports, earnings releases, investor presentations, and official company communications are important primary sources. BullBrief may summarize or visualize some of this material, but summaries can omit context.",
        "A filing summary cannot replace reading the filing. Risk factors, footnotes, management discussion, liquidity disclosures, segment disclosures, litigation disclosures, related-party disclosures, debt terms, and subsequent events can matter materially.",
      ],
    },
    {
      title: "7. No Guarantee of Results",
      paragraphs: [
        "BullBrief does not guarantee returns, income, alpha, downside protection, risk reduction, tax efficiency, or any specific financial result. BullBrief does not guarantee that a bullish-looking company will rise or that a bearish-looking company will fall.",
        "The market can disagree with fundamentals for long periods. A company can be high quality and still become a poor investment at the wrong price. A company can look cheap and still decline further.",
      ],
    },
    {
      title: "8. Past Performance and Backward-Looking Metrics",
      paragraphs: [
        "Many BullBrief metrics are historical. Revenue growth, EPS, margin expansion, return on equity, free cash flow, dividend yield, P/E, PEG, beta, short interest, institutional ownership, analyst-style comparisons, and price charts do not predict the future by themselves.",
        "Past performance does not guarantee future results. Historical volatility does not capture every future risk. A company's prior earnings, valuation multiple, market share, or stock price behavior may not continue.",
      ],
    },
    {
      title: "9. Forward-Looking Statements",
      paragraphs: [
        "BullBrief may display or summarize forward-looking concepts such as outlook, catalysts, risks, growth expectations, price targets, estimates, guidance, margin expansion, revenue potential, AI opportunity, macro exposure, product cycles, or competitive positioning.",
        "Forward-looking statements are uncertain. They may depend on assumptions that prove wrong. They can be affected by rates, inflation, regulation, competition, litigation, supply chains, geopolitics, labor, customer demand, currency, management execution, capital allocation, financing conditions, and many other factors.",
      ],
    },
    {
      title: "10. Conflicts, Promotions, and Independence",
      paragraphs: [
        "Unless BullBrief expressly states otherwise, BullBrief does not receive compensation from issuers for favorable coverage. However, conflicts can exist in any financial information product, including data-provider limits, model-provider behavior, affiliate relationships, sponsorships, ownership interests, or user incentives.",
        "If BullBrief later adds paid promotions, affiliate relationships, sponsorships, issuer relationships, or monetized referrals, those relationships should be disclosed where required. Users should remain skeptical of any financial content that appears promotional.",
      ],
    },
    {
      title: "11. High-Risk Products and Strategies",
      paragraphs: [
        "BullBrief may mention companies that are associated with volatile industries or securities. BullBrief may also show information that users apply to options, leverage, margin, short selling, ETFs, derivatives, crypto-related equities, penny stocks, microcaps, foreign issuers, ADRs, SPACs, distressed securities, or other high-risk areas.",
        "High-risk products and strategies can lead to rapid losses. Some can create losses greater than the original amount invested. BullBrief does not evaluate whether you understand these risks.",
      ],
    },
    {
      title: "12. Tax, Legal, and Accounting Issues",
      paragraphs: [
        "Investment decisions can create tax, legal, and accounting consequences. BullBrief does not provide tax, legal, or accounting advice. BullBrief does not evaluate wash sales, holding periods, capital gains, losses, retirement account rules, estate planning, charitable giving, entity structures, employee stock compensation, insider status, restricted securities, or jurisdiction-specific rules.",
        "Consult qualified tax, legal, and accounting professionals for those issues.",
      ],
    },
    {
      title: "13. Do Your Own Research",
      paragraphs: [
        "BullBrief is a starting point. Sensible research may include reading SEC filings, earnings transcripts, investor presentations, audited financial statements, footnotes, segment disclosures, debt agreements, customer concentration disclosures, risk factors, and independent sources.",
        "You should compare multiple sources and understand what each metric means before relying on it.",
      ],
    },
    {
      title: "14. Regulatory and Investor Education Resources",
      paragraphs: [
        "Public investor education resources can help users understand the difference between general information and regulated advice. BullBrief links to these resources for education only and does not control them.",
      ],
      bullets: [
        "SEC Investor.gov investment adviser overview: https://www.investor.gov/introduction-investing/investing-basics/glossary/investment-adviser",
        "FINRA investment adviser investor education: https://www.finra.org/investors/investing/working-with-investment-professional/investment-advisers",
        "SEC and FINRA AI investment fraud alert: https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-alerts/artificial-intelligence-fraud",
      ],
    },
    {
      title: "15. User Acceptance",
      paragraphs: [
        "By using BullBrief, you acknowledge that you understand BullBrief is not investment advice, that financial decisions involve risk, that AI can be wrong, that third-party data can be wrong, and that you remain solely responsible for your decisions.",
      ],
    },
    ...advancedDisclaimerSections,
  ],
};

export const privacyContent: LegalDocument = {
  title: "Privacy Policy",
  eyebrow: "Privacy and Data",
  updated: LEGAL_UPDATED,
  intro: [
    "This Privacy Policy explains how BullBrief may collect, use, process, store, disclose, and protect information when you use the service.",
    "BullBrief is a financial research interface. You should not submit brokerage credentials, account numbers, Social Security numbers, tax IDs, bank information, private keys, passwords, insider information, health information, or other sensitive information into BullBrief.",
  ],
  sections: [
    {
      title: "1. Information You Provide",
      paragraphs: [
        "You may provide information when you search for tickers, compare securities, generate summaries, submit prompts, contact BullBrief, create an account if accounts are offered, provide feedback, or otherwise interact with the service.",
        "Depending on the features available, this information may include name, email address, ticker searches, comparison lists, prompts, feedback, account information, billing-related information handled by payment processors, and support messages.",
      ],
    },
    {
      title: "2. Information Collected Automatically",
      paragraphs: [
        "BullBrief may automatically collect technical and usage information, such as IP address, device type, browser type, operating system, referring pages, pages viewed, timestamps, approximate location derived from IP address, session identifiers, feature usage, error logs, and performance data.",
        "BullBrief may use cookies, local storage, session storage, server logs, analytics tools, security tools, and similar technologies. The app may use session-scoped caching to avoid repeated API calls and improve performance.",
      ],
    },
    {
      title: "3. Financial Search Data",
      paragraphs: [
        "Ticker searches, company lookups, compare lists, chart interactions, and generated summaries can reveal interests in particular securities or sectors. Treat this information as potentially sensitive.",
        "BullBrief uses this information to provide requested features, improve product quality, monitor abuse, debug errors, and understand aggregate usage. BullBrief does not need your brokerage login, account balances, positions, trade history, or tax records to provide general research features.",
      ],
    },
    {
      title: "4. AI Providers and Processing",
      paragraphs: [
        "BullBrief may send prompts, ticker symbols, company names, financial data, generated context, and user inputs to AI model providers to produce summaries and reports. Do not submit confidential or sensitive information into prompts.",
        "AI providers may process data according to their own terms, privacy policies, security practices, and data retention settings. BullBrief attempts to send only information needed to provide the requested feature.",
      ],
    },
    {
      title: "5. Market Data and Infrastructure Providers",
      paragraphs: [
        "BullBrief may use third-party market data providers, SEC data sources, charting providers, hosting providers, analytics providers, logging providers, payment processors, email providers, and security providers.",
        "These providers may process information as necessary to provide their services, comply with law, protect systems, enforce terms, and maintain reliability.",
      ],
    },
    {
      title: "6. How BullBrief Uses Information",
      paragraphs: [
        "BullBrief may use information to operate the service, display requested research, generate AI content, maintain session caches, troubleshoot issues, monitor performance, improve features, prevent abuse, enforce terms, communicate with users, process payments if offered, maintain security, comply with law, and protect rights.",
      ],
      bullets: [
        "Provide ticker search, summaries, charts, comparisons, glossary pages, and reports.",
        "Reduce duplicate AI and data-provider calls within a session.",
        "Detect abuse, scraping, automated attacks, fraud, spam, or security threats.",
        "Analyze aggregate product usage and reliability.",
        "Respond to support requests and user feedback.",
      ],
    },
    {
      title: "7. How Information Is Shared",
      paragraphs: [
        "BullBrief may share information with service providers that help operate the product, with professional advisers, with authorities when legally required, in connection with a business transaction, to enforce terms, to protect rights and safety, or with your direction or consent.",
        "BullBrief does not claim to sell personal financial account information. BullBrief does not need brokerage credentials and users should not provide them.",
      ],
    },
    {
      title: "8. Cookies and Storage",
      paragraphs: [
        "BullBrief may use cookies, local storage, and session storage for navigation, preferences, caching, security, analytics, and performance. Some browser settings may allow you to block or delete these technologies, but doing so can break parts of the service.",
        "Session-scoped caching may store API responses in your browser session to reduce duplicate calls. This can include AI-generated content, ticker summaries, comparison outputs, or chart data requested during that session.",
      ],
    },
    {
      title: "9. Data Retention",
      paragraphs: [
        "BullBrief keeps information for as long as reasonably necessary for the purposes described in this Policy, unless a longer period is required or permitted by law. Retention periods can vary based on account status, security needs, legal obligations, backups, logs, analytics, payment records, and dispute needs.",
      ],
    },
    {
      title: "10. Security",
      paragraphs: [
        "BullBrief uses reasonable technical and organizational measures designed to protect information. No method of transmission or storage is completely secure. BullBrief cannot guarantee absolute security.",
        "You are responsible for protecting your devices, accounts, browser sessions, passwords, and network access.",
      ],
    },
    {
      title: "11. Children",
      paragraphs: [
        "BullBrief is not directed to children. BullBrief does not knowingly collect personal information from children under the age required by applicable law. If you believe a child provided personal information, contact BullBrief so appropriate steps can be taken.",
      ],
    },
    {
      title: "12. Your Privacy Rights",
      paragraphs: [
        "Depending on your location, you may have rights to access, correct, delete, export, restrict, or object to certain processing of personal information. You may also have rights related to consent withdrawal and appeals.",
        "These rights are not absolute and may be subject to verification, legal exceptions, security needs, and retention obligations. BullBrief will respond to valid requests as required by applicable law.",
      ],
    },
    {
      title: "13. International Users",
      paragraphs: [
        "BullBrief may process information in the United States or other countries where service providers operate. Laws in those countries may differ from the laws where you live.",
        "By using BullBrief, you understand that information may be transferred, stored, and processed outside your jurisdiction where permitted by law.",
      ],
    },
    {
      title: "14. Changes to This Policy",
      paragraphs: [
        "BullBrief may update this Privacy Policy from time to time. The updated date identifies the latest version. Continued use of BullBrief after changes become effective means you acknowledge the updated Policy.",
      ],
    },
    {
      title: "15. Contact",
      paragraphs: [
        "For privacy questions, use the contact method provided by BullBrief. Do not include brokerage credentials, account numbers, Social Security numbers, tax IDs, private keys, passwords, or other sensitive data in general contact messages.",
      ],
    },
    ...advancedPrivacySections,
  ],
};
