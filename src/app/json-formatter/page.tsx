"use client";

import { useJsonFormatter } from "./useJsonFormatter";
import { Code, CheckCircle, AlertCircle, Copy, Trash2, Maximize2, Minimize2, Settings2, FileCode2 } from "lucide-react";
import { useState } from "react";
import Editor from "@monaco-editor/react";

// [TL-JSON-F-01: JSON Formatter Page (Pro)]
export default function JsonFormatterPage() {
  const {
    input,
    setInput,
    output,
    error,
    formatJson,
    autoFixJson,
    minifyJson,
    generateTsTypes,
    copyToClipboard,
    clearAll,
  } = useJsonFormatter();

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard();
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 md:space-y-6 overflow-hidden px-1">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
          JSON Formatter <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">Pro</span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base md:text-lg font-medium max-w-2xl mx-auto w-full px-2">
          Powered by VS Code Engine. Exact error tracing, Auto-Fix, and TS Interface generation.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 bg-white/60 backdrop-blur-xl p-3 md:p-4 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <button 
          onClick={() => formatJson(2)}
          className="flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 shadow-md shadow-blue-500/20 text-xs md:text-sm"
        >
          <Maximize2 className="w-3.5 h-3.5 md:w-4 md:h-4" /> Format
        </button>
        <button 
          onClick={() => autoFixJson(2)}
          className="flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 shadow-md shadow-indigo-500/20 text-xs md:text-sm"
          title="Fix trailing commas, single quotes, or missing quotes"
        >
          <Settings2 className="w-3.5 h-3.5 md:w-4 md:h-4" /> Auto-Fix
        </button>
        <button 
          onClick={minifyJson}
          className="flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-5 md:py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 shadow-md text-xs md:text-sm"
        >
          <Minimize2 className="w-3.5 h-3.5 md:w-4 md:h-4" /> Minify
        </button>
        <div className="w-px h-6 md:h-8 bg-slate-200 mx-1 md:mx-2 hidden sm:block"></div>
        <button 
          onClick={generateTsTypes}
          className="flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 shadow-md shadow-emerald-500/20 text-xs md:text-sm"
        >
          <FileCode2 className="w-3.5 h-3.5 md:w-4 md:h-4" /> TS Types
        </button>
        <div className="w-px h-6 md:h-8 bg-slate-200 mx-1 md:mx-2 hidden sm:block"></div>
        <button 
          onClick={clearAll}
          className="flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-5 md:py-2.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl transition-all hover:-translate-y-0.5 text-xs md:text-sm"
        >
          <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" /> Clear
        </button>
      </div>

      {/* 2-Pane Editor */}
      <div className="p-3 md:p-6 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 md:gap-6 h-auto lg:h-[550px]">
          {/* Input Pane */}
          <div className="flex flex-col bg-[#1e1e1e] rounded-2xl border border-slate-800 shadow-inner overflow-hidden group h-[300px] lg:h-full">
            <div className="px-4 py-3 border-b border-slate-800 bg-[#252526] flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-slate-300 text-sm tracking-wide">
                <Code className="w-4 h-4 text-blue-400" /> Input JSON
              </div>
            </div>
            <div className="flex-1 w-full min-h-0 relative">
              <Editor
                height="100%"
                defaultLanguage="json"
                theme="vs-dark"
                value={input}
                onChange={(value) => setInput(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  formatOnPaste: true,
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  padding: { top: 16, bottom: 16 },
                  scrollbar: { alwaysConsumeMouseWheel: false }
                }}
              />
            </div>
          </div>

          {/* Output Pane */}
          <div className={`flex flex-col bg-[#1e1e1e] rounded-2xl border shadow-inner overflow-hidden transition-colors h-[300px] lg:h-full ${error ? 'border-red-500/50' : 'border-slate-800'}`}>
            <div className="px-4 py-3 border-b border-slate-800 bg-[#252526] flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-slate-300 text-sm tracking-wide">
                {error ? (
                  <span className="text-red-400 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Syntax Error</span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Output</span>
                )}
              </div>
              {output && !error && (
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition"
                >
                  {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>
            <div className="flex-1 w-full min-h-0 relative">
              {error ? (
                <div className="p-6 text-red-400 font-mono text-sm whitespace-pre-wrap overflow-auto h-full">{error}</div>
              ) : (
                <Editor
                  height="100%"
                  language="typescript"
                  theme="vs-dark"
                  value={output}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    padding: { top: 16, bottom: 16 },
                    scrollbar: { alwaysConsumeMouseWheel: false }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
