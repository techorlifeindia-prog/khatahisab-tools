"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function SearchInput({ className }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  // Sync state with URL when user navigates
  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    // If not on homepage, redirect to homepage with query
    if (window.location.pathname !== "/") {
      router.push(`/?q=${encodeURIComponent(val)}`);
    } else {
      router.replace(`/?q=${encodeURIComponent(val)}`);
    }
  };

  return (
    <div className={`relative group w-full ${className || ""}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
      </div>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search for tools..."
        className="block w-full pl-9 pr-4 py-2 bg-slate-100/80 border border-transparent rounded-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 shadow-sm transition-all font-medium"
      />
    </div>
  );
}

export function GlobalSearch({ className }: { className?: string }) {
  return (
    <Suspense fallback={<div className={`w-full h-9 bg-slate-100/80 rounded-full animate-pulse ${className || ""}`}></div>}>
      <SearchInput className={className} />
    </Suspense>
  );
}
