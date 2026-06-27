import Link from "next/link";
import { ArrowLeft, Search, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
        <div className="relative bg-white/50 backdrop-blur-xl border border-slate-200/50 p-6 rounded-[2rem] shadow-2xl shadow-blue-900/5">
          <div className="bg-slate-900 text-white w-24 h-24 rounded-3xl flex items-center justify-center rotate-12 mx-auto mb-2 shadow-inner">
            <Compass className="w-12 h-12" />
          </div>
          <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-800 to-slate-400 tracking-tighter">
            404
          </h1>
        </div>
      </div>

      <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
        Oops! You seem to be lost.
      </h2>
      <p className="text-slate-500 font-medium max-w-md mx-auto mb-10 text-lg leading-relaxed">
        We can't find the page you're looking for. It might have been moved, renamed, or perhaps never existed.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link 
          href="/"
          className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-600/20 w-full sm:w-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 transition-opacity"></div>
          <ArrowLeft className="w-5 h-5 relative z-10 group-hover:-translate-x-1 transition-transform" />
          <span className="relative z-10">Back to Home</span>
        </Link>
        
        <Link 
          href="/?focus=search"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 font-bold rounded-xl border-2 border-slate-200 transition-all hover:bg-slate-50 hover:border-slate-300 w-full sm:w-auto"
        >
          <Search className="w-5 h-5 text-slate-400" />
          <span>Search Tools</span>
        </Link>
      </div>
    </div>
  );
}
