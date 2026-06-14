"use client";

import { useWordCounter } from "./useWordCounter";
import { Type, AlignLeft, Clock, Hash } from "lucide-react";

// [TL-WORD-F-01: Word Counter Page]
export default function WordCounterPage() {
  const { text, setText, stats } = useWordCounter();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
          Word & Character Counter
        </h1>
        <p className="text-slate-600 text-lg font-medium">
          Real-time text analysis, character count, and SEO keyword density.
        </p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="p-6 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center transform transition-all hover:-translate-y-1 hover:bg-white/80">
          <Type className="w-8 h-8 text-blue-500 mb-3" />
          <div className="text-4xl font-extrabold text-slate-900">{stats.words}</div>
          <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-1">Words</div>
        </div>
        <div className="p-6 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center transform transition-all hover:-translate-y-1 hover:bg-white/80">
          <Hash className="w-8 h-8 text-indigo-500 mb-3" />
          <div className="text-4xl font-extrabold text-slate-900">{stats.characters}</div>
          <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-1">Characters</div>
        </div>
        <div className="p-6 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center transform transition-all hover:-translate-y-1 hover:bg-white/80">
          <AlignLeft className="w-8 h-8 text-sky-500 mb-3" />
          <div className="text-4xl font-extrabold text-slate-900">{stats.sentences}</div>
          <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-1">Sentences</div>
        </div>
        <div className="p-6 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center transform transition-all hover:-translate-y-1 hover:bg-white/80">
          <Clock className="w-8 h-8 text-green-500 mb-3" />
          <div className="text-4xl font-extrabold text-slate-900">{stats.readingTimeMin} <span className="text-lg font-semibold text-slate-400">min</span></div>
          <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-1">Reading Time</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Text Area */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="relative flex-1 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <textarea
              className="w-full h-full min-h-[250px] md:min-h-[350px] p-6 md:p-8 bg-transparent text-slate-900 placeholder:text-slate-400 font-medium text-base md:text-lg focus:outline-none resize-y"
              placeholder="Start typing or paste your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              spellCheck="false"
            />
            {text && (
              <button 
                onClick={() => setText('')}
                className="absolute top-6 right-6 text-sm font-bold px-4 py-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 hover:-translate-y-0.5 transition-all shadow-sm"
              >
                Clear text
              </button>
            )}
          </div>
          <div className="mt-4 flex gap-6 text-sm text-slate-500 font-medium px-2">
            <div>Characters (no spaces): <span className="font-extrabold text-slate-800">{stats.charactersNoSpaces}</span></div>
            <div>Paragraphs: <span className="font-extrabold text-slate-800">{stats.paragraphs}</span></div>
          </div>
        </div>

        {/* Keyword Density Sidebar */}
        <div className="lg:col-span-4 h-fit bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
          <h3 className="font-extrabold text-xl text-slate-900 flex items-center mb-6">
            <div className="p-2 bg-indigo-100 rounded-xl mr-3"><Hash className="w-5 h-5 text-indigo-600" /></div> Keyword Density
          </h3>
          
          {stats.keywordDensity.length > 0 ? (
            <div className="space-y-4">
              {stats.keywordDensity.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between group p-2 hover:bg-white/80 rounded-xl transition-colors">
                  <div className="flex items-center gap-3 w-full">
                    <span className="w-6 text-center text-sm font-bold text-slate-400">{idx + 1}.</span>
                    <span className="font-bold text-slate-700 flex-1 truncate group-hover:text-blue-600 transition">
                      {item.word}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-lg font-extrabold shadow-sm">
                        {item.count}
                      </span>
                      <span className="w-12 text-right text-sm font-bold text-slate-500">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-base font-medium text-slate-500 bg-white/40 rounded-2xl border border-dashed border-slate-300">
              Paste some text to see<br/>SEO keyword analysis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
