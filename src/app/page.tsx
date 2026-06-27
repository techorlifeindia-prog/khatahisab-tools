"use client";

import { ArrowRight, Calculator, FileText, Image as ImageIcon, Code, Type, Clock, Search, Wand2, QrCode, Sparkles, Rocket } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { GlobalSearch } from "@/components/GlobalSearch";

// [TL-HOME-F-01: Main Tool Hub Homepage]
function HomeContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const tools = [
    {
      title: "AI Business Booster",
      description: "Automate your Local SEO, Google Profile, review replies, and social posts.",
      icon: <Rocket className="w-5 h-5 text-white" />,
      href: "/business-booster",
      category: "Marketing",
      color: "bg-blue-500 shadow-blue-500/20",
      cardBg: "bg-blue-50 border-blue-200",
      badgeColor: "text-blue-600 bg-blue-100/50 border-blue-200",
    },
    {
      title: "Age Calculator",
      description: "Calculate your exact age in days, months, and years instantly.",
      icon: <Clock className="w-5 h-5 text-white" />,
      href: "/age-calculator",
      category: "Utility",
      color: "bg-indigo-500 shadow-indigo-500/20",
      cardBg: "bg-indigo-50 border-indigo-200",
      badgeColor: "text-indigo-600 bg-indigo-100/50 border-indigo-200",
    },
    {
      title: "Word & Character",
      description: "Count words, characters, and check keyword density in real-time.",
      icon: <Type className="w-5 h-5 text-white" />,
      href: "/word-counter",
      category: "Text",
      color: "bg-violet-500 shadow-violet-500/20",
      cardBg: "bg-violet-50 border-violet-200",
      badgeColor: "text-violet-600 bg-violet-100/50 border-violet-200",
    },
    {
      title: "JSON Formatter",
      description: "Format, validate, and beautify your JSON data securely in the browser.",
      icon: <Code className="w-5 h-5 text-white" />,
      href: "/json-formatter",
      category: "Developer",
      color: "bg-emerald-500 shadow-emerald-500/20",
      cardBg: "bg-emerald-50 border-emerald-200",
      badgeColor: "text-emerald-700 bg-emerald-100/50 border-emerald-200",
    },
    {
      title: "Image Compressor",
      description: "Compress images locally without uploading to any server.",
      icon: <ImageIcon className="w-5 h-5 text-white" />,
      href: "/image-compressor",
      category: "Media",
      color: "bg-orange-500 shadow-orange-500/20",
      cardBg: "bg-orange-50 border-orange-200",
      badgeColor: "text-orange-700 bg-orange-100/50 border-orange-200",
    },
    {
      title: "PDF Magic",
      description: "Securely merge and organize PDF files locally without server uploads.",
      icon: <Wand2 className="w-5 h-5 text-white" />,
      href: "/pdf-magic",
      category: "Document",
      color: "bg-rose-500 shadow-rose-500/20",
      cardBg: "bg-rose-50 border-rose-200",
      badgeColor: "text-rose-600 bg-rose-100/50 border-rose-200",
    },
    {
      title: "Smart QR Generator",
      description: "Generate customized high-quality QR codes for Links, Wi-Fi, WhatsApp.",
      icon: <QrCode className="w-5 h-5 text-white" />,
      href: "/qr-generator",
      category: "Utility",
      color: "bg-pink-500 shadow-pink-500/20",
      cardBg: "bg-pink-50 border-pink-200",
      badgeColor: "text-pink-600 bg-pink-100/50 border-pink-200",
    },
    {
      title: "Background Remover",
      description: "Remove image backgrounds instantly and securely. 100% local AI processing.",
      icon: <Sparkles className="w-5 h-5 text-white" />,
      href: "/bg-remover",
      category: "Media",
      color: "bg-teal-500 shadow-teal-500/20",
      cardBg: "bg-teal-50 border-teal-200",
      badgeColor: "text-teal-700 bg-teal-100/50 border-teal-200",
    },
  ];

  const filteredTools = tools.filter(tool =>
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-4 md:gap-6">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center gap-3 md:gap-4 px-3 w-full pt-4 md:pt-8">
        
        {/* Title & Subtitle (Visible on all devices, but compact on mobile) */}
        <div className="w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] md:leading-tight">
            Superfast Free <br className="md:hidden" />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">Online Tools</span>
          </h1>
          <p className="mt-2 md:mt-4 text-[13px] sm:text-base md:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed px-1">
            A premium collection of high-performance utilities. No intrusive ads, no server uploads. 100% Secure & Local Processing.
          </p>
        </div>

        {/* Mobile Search */}
        <div className="w-full md:hidden mt-1 px-1">
          <GlobalSearch className="w-full" />
        </div>

      </section>

      {/* Tools Grid */}
      <section>
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
            {filteredTools.map((tool, idx) => (
              <Link
                key={idx}
                href={tool.href}
                className={`group relative flex flex-col p-4 md:p-5 rounded-[20px] border shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 active:scale-95 active:shadow-inner ${tool.cardBg}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-[14px] shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300 ${tool.color}`}>
                    {tool.icon}
                  </div>
                  <span className={`text-[9px] font-extrabold px-2 py-1 rounded-md border uppercase tracking-widest ${tool.badgeColor}`}>
                    {tool.category}
                  </span>
                </div>
                <h3 className="font-extrabold text-[15px] text-slate-800 mb-1.5 leading-tight">{tool.title}</h3>
                <p className="text-[12px] text-slate-500 font-medium flex-1 leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white/40 backdrop-blur-md rounded-3xl border border-dashed border-slate-300">
            <Search className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">No tools found</h3>
            <p className="text-slate-500 font-medium">Try searching for a different keyword.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto py-20 text-center text-slate-500 font-medium animate-pulse">Loading Tools...</div>}>
      <HomeContent />
    </Suspense>
  );
}
