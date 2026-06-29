"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { User, LogOut, ShieldCheck, ChevronDown } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse"></div>;
  }

  if (status === "unauthenticated" || !session) {
    return (
      <button
        onClick={() => signIn()}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow"
      >
        <User className="w-4 h-4" />
        <span>Login</span>
      </button>
    );
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-slate-100 p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-slate-200"
      >
        {session.user?.image ? (
          <img
            src={session.user.image}
            alt="User avatar"
            className="w-8 h-8 rounded-full object-cover border border-slate-200"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {getInitials(session.user?.name)}
          </div>
        )}
        <div className="hidden md:flex flex-col items-start leading-none max-w-[100px]">
          <span className="text-sm font-bold text-slate-700 truncate w-full">
            {session.user?.name || "User"}
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden"
          >
            <div className="px-4 py-2 border-b border-slate-100 mb-2">
              <p className="text-sm font-bold text-slate-800 truncate">
                {session.user?.name || "User"}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {session.user?.email || ""}
              </p>
            </div>

            {/* If user is admin (you can add a role check here if needed), show Admin Dashboard link */}
            <Link
              href="/admin/users"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </Link>

            <button
              onClick={() => signOut()}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
