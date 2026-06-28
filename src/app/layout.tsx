import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Crop, Wand2, Code, Image as ImageIcon, Type, Sparkles, Rocket } from "lucide-react";
import Link from "next/link";
import "./globals.css";
import { GlobalSearch } from "@/components/GlobalSearch";
import { Analytics } from "@vercel/analytics/react";
import { MobileMenu } from "@/components/MobileMenu";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | KhataHisab Tools',
    default: 'KhataHisab Tools - Superfast Free Online Utilities',
  },
  description: 'A premium collection of high-performance, free online tools. Including PDF Magic, Background Remover, QR Generator, and more. 100% Secure & Local Processing.',
  keywords: ['free online tools', 'pdf tools', 'background remover', 'qr code generator', 'json formatter', 'age calculator', 'image compressor', 'khatahisab tools'],
  authors: [{ name: 'KhataHisab' }],
  creator: 'KhataHisab',
  publisher: 'KhataHisab',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tools.khatahisab.in',
    siteName: 'KhataHisab Tools',
    title: 'KhataHisab Tools - Superfast Free Online Utilities',
    description: 'A premium collection of high-performance, free online tools. No ads, 100% secure.',
    images: [
      {
        url: 'https://tools.khatahisab.in/logo.svg', // Fallback, usually an actual image works best
        width: 800,
        height: 600,
        alt: 'KhataHisab Tools Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KhataHisab Tools - Free Online Utilities',
    description: 'A premium collection of free online tools. 100% Secure & Local Processing.',
    creator: '@khatahisab',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#0B0F19',
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
        <AuthProvider>
        {/* Animated Background Blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-400/20 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-emerald-400/10 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-white/50 bg-white/70 backdrop-blur-xl shadow-sm">
          <div className="w-full px-2 md:px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity">
              <img src="/logo.svg" alt="KhataHisab Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight text-slate-900">Khata<span className="text-red-600">Hisab</span></span>
                <span className="bg-blue-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm mt-1">Tools</span>
              </div>
            </Link>

            <GlobalSearch className="max-w-md hidden md:block ml-8" />

            <div className="flex items-center gap-4">
              <nav className="hidden md:flex gap-8">
                <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">All Tools</Link>
                <Link href="/?q=Developer" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Developer</Link>
                <Link href="/?q=Media" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Media</Link>
              </nav>
              <MobileMenu />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 w-full px-2 md:px-4 py-2 md:py-4 relative z-10 flex gap-2 md:gap-4 lg:gap-6">
          {/* Left Sidebar - Quick Links */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Featured Tools</h3>
              <nav className="space-y-1">
                <Link href="/business-booster" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all text-slate-600 hover:text-blue-600 group">
                  <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Rocket className="w-4 h-4" /></div>
                  <span className="font-semibold text-sm">AI Business Booster</span>
                </Link>
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
                <Link href="/bg-remover" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all text-slate-600 hover:text-pink-600 group">
                  <div className="p-1.5 rounded-lg bg-pink-100 text-pink-600 group-hover:bg-pink-500 group-hover:text-white transition-colors"><Sparkles className="w-4 h-4" /></div>
                  <span className="font-semibold text-sm">Background Remover</span>
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
                  <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-xs">2</span>
                </a>
                <a href="#" className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white text-slate-600 hover:text-blue-600 transition-all text-sm font-semibold">
                  <span>Utilities</span>
                  <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-xs">2</span>
                </a>
              </nav>
            </div>
          </aside>

          <main className="flex-1 min-w-0 overflow-x-hidden w-full max-w-full">
            {children}
          </main>
        </div>

        {/* Footer */}
        <Footer />
        <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
