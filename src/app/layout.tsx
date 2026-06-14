import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Crop, Wand2, Code, Image as ImageIcon, Type } from "lucide-react";
import Link from "next/link";
import "./globals.css";
import { GlobalSearch } from "@/components/GlobalSearch";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "M3Bharat Tools - Free Online Tools",
  description: "A collection of premium, fast, and free online tools by M3Bharat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col font-sans antialiased bg-slate-50 text-slate-900 relative overflow-x-hidden`}
      >
        {/* Animated Background Blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-400/20 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-emerald-400/10 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-white/50 bg-white/70 backdrop-blur-xl shadow-sm">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">M</div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">M3Bharat Tools</span>
            </Link>

            <GlobalSearch />

            <nav className="hidden md:flex gap-8">
              <a href="#" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">All Tools</a>
              <a href="#" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Developer</a>
              <a href="#" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Media</a>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 container mx-auto px-4 py-4 md:py-8 relative z-10 flex gap-6 lg:gap-8">
          {/* Left Sidebar - Quick Links */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Featured Tools</h3>
              <nav className="space-y-1">
                <Link href="/pdf-magic" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all text-slate-600 hover:text-orange-600 group">
                  <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors"><Crop className="w-4 h-4" /></div>
                  <span className="font-semibold text-sm">Label Crop Pro</span>
                </Link>
                <Link href="/pdf-magic" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all text-slate-600 hover:text-rose-600 group">
                  <div className="p-1.5 rounded-lg bg-rose-100 text-rose-600 group-hover:bg-rose-500 group-hover:text-white transition-colors"><Wand2 className="w-4 h-4" /></div>
                  <span className="font-semibold text-sm">PDF Magic</span>
                </Link>
                <Link href="/json-formatter" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all text-slate-600 hover:text-green-600 group">
                  <div className="p-1.5 rounded-lg bg-green-100 text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors"><Code className="w-4 h-4" /></div>
                  <span className="font-semibold text-sm">JSON Formatter</span>
                </Link>
                <Link href="/image-compressor" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all text-slate-600 hover:text-purple-600 group">
                  <div className="p-1.5 rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-colors"><ImageIcon className="w-4 h-4" /></div>
                  <span className="font-semibold text-sm">Image Compressor</span>
                </Link>
                <Link href="/word-counter" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all text-slate-600 hover:text-indigo-600 group">
                  <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white transition-colors"><Type className="w-4 h-4" /></div>
                  <span className="font-semibold text-sm">Word Counter</span>
                </Link>
              </nav>

              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2 mt-8">Categories</h3>
              <nav className="space-y-1">
                <a href="#" className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white text-slate-600 hover:text-blue-600 transition-all text-sm font-semibold">
                  <span>Document Tools</span>
                  <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-xs">1</span>
                </a>
                <a href="#" className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white text-slate-600 hover:text-blue-600 transition-all text-sm font-semibold">
                  <span>Developer Tools</span>
                  <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-xs">1</span>
                </a>
                <a href="#" className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white text-slate-600 hover:text-blue-600 transition-all text-sm font-semibold">
                  <span>Media Tools</span>
                  <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-xs">1</span>
                </a>
                <a href="#" className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white text-slate-600 hover:text-blue-600 transition-all text-sm font-semibold">
                  <span>Utilities</span>
                  <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-xs">2</span>
                </a>
              </nav>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/50 py-8 bg-white/50 backdrop-blur-sm relative z-10">
          <div className="container mx-auto px-4 text-center text-sm font-medium text-slate-500">
            &copy; {new Date().getFullYear()} M3Bharat Tools. All rights reserved. Built with ⚡ Speed & Privacy.
          </div>
        </footer>
      </body>
    </html>
  );
}
