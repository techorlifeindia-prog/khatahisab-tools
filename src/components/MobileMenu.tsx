"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Auto-close menu when the route changes (e.g. when opening a tool)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-600 hover:text-blue-600 bg-slate-100 rounded-lg transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-lg py-4 px-6 flex flex-col gap-4 z-50 animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-4">
            <Link href="/" onClick={() => setIsOpen(false)} className="text-base font-semibold text-slate-700 hover:text-blue-600">All Tools</Link>
            <div className="h-px w-full bg-slate-100"></div>
            <Link href="#" onClick={() => setIsOpen(false)} className="text-base font-semibold text-slate-700 hover:text-blue-600">Developer</Link>
            <div className="h-px w-full bg-slate-100"></div>
            <Link href="#" onClick={() => setIsOpen(false)} className="text-base font-semibold text-slate-700 hover:text-blue-600">Media</Link>
          </nav>
        </div>
      )}
    </div>
  );
}
