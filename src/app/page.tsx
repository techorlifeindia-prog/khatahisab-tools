"use client";

import { ArrowRight, Calculator, FileText, Image as ImageIcon, Code, Type, Clock, Search, Wand2, QrCode, Sparkles, Rocket } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// [TL-HOME-F-01: Main Tool Hub Homepage]
function HomeContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const tools = [
    {
      title: "AI Business Booster",
      description: "Automate your Local SEO, Google Profile, review replies, and social posts.",
      icon: <Rocket className="w-6 h-6 text-blue-600" />,
      href: "/business-booster",
      category: "Marketing",
    },
    {
      title: "Age Calculator",
      description: "Calculate your exact age in days, months, and years instantly.",
      icon: <Clock className="w-6 h-6 text-blue-500" />,
      href: "/age-calculator",
      category: "Utility",
    },
    {
      title: "Word & Character Counter",
      description: "Count words, characters, and check keyword density in real-time.",
      icon: <Type className="w-6 h-6 text-indigo-500" />,
      href: "/word-counter",
      category: "Text",
    },
    {
      title: "JSON Formatter",
      description: "Format, validate, and beautify your JSON data securely in the browser.",
      icon: <Code className="w-6 h-6 text-green-500" />,
      href: "/json-formatter",
      category: "Developer",
    },
    {
      title: "Image Compressor",
      description: "Compress images locally without uploading to any server.",
      icon: <ImageIcon className="w-6 h-6 text-purple-500" />,
      href: "/image-compressor",
      category: "Media",
    },
    {
      title: "PDF Magic",
      description: "Securely merge and organize PDF files locally without server uploads.",
      icon: <Wand2 className="w-6 h-6 text-rose-500" />,
      href: "/pdf-magic",
      category: "Document",
    },
    {
      title: "Smart QR Generator",
      description: "Generate customized high-quality QR codes for Links, Wi-Fi, WhatsApp & more.",
      icon: <QrCode className="w-6 h-6 text-pink-500" />,
      href: "/qr-generator",
      category: "Utility",
    },
    {
      title: "AI Background Remover",
      description: "Remove image backgrounds instantly and securely. 100% local AI processing.",
      icon: <Sparkles className="w-6 h-6 text-rose-500" />,
      href: "/bg-remover",
      category: "Media",
    },
  ];

  const filteredTools = tools.filter(tool =>
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 md:gap-10">
      {/* Hero Section */}
      <section className="text-center pt-0 md:pt-4 flex flex-col items-center gap-4 md:gap-6 px-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight text-balance">
          Superfast Free <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text block sm:inline">Online Tools</span>
        </h1>
        <p className="text-sm sm:text-base md:text-xl text-slate-600 max-w-2xl mx-auto font-medium px-2 text-balance leading-relaxed">
          A premium collection of high-performance utilities. No intrusive ads, no server uploads. 100% Secure & Local Processing.
        </p>

        {/* Search Bar moved to Global Header */}
      </section>

      {/* Tools Grid */}
      <section>
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool, idx) => (
              <Link
                key={idx}
                href={tool.href}
                className="group relative flex flex-col p-5 md:p-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.1)] transition-all duration-300 hover:-translate-y-1 hover:bg-white/80"
              >
                <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="p-2.5 md:p-3.5 bg-white shadow-sm border border-slate-100 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 flex-shrink-0">
                    {tool.icon}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg md:text-xl text-slate-800 leading-tight">{tool.title}</h3>
                    <span className="text-[10px] md:text-xs font-bold px-2.5 md:px-3 py-0.5 md:py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 mt-1.5 inline-block">
                      {tool.category}
                    </span>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-slate-600 font-medium flex-1 leading-relaxed">
                  {tool.description}
                </p>
                <div className="mt-6 flex items-center text-sm font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 duration-300">
                  Use Tool <ArrowRight className="w-5 h-5 ml-1" />
                </div>
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
