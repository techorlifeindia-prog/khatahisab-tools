"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";

export default function SearchForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const currentSearch = searchParams.get("search") || "";
      
      // Only push to router if the search term actually changed
      if (currentSearch !== search.trim()) {
        const params = new URLSearchParams(searchParams.toString());
        if (search.trim()) {
          params.set("search", search.trim());
        } else {
          params.delete("search");
        }
        params.set("page", "1"); // Reset page to 1 on new search
        router.push(`?${params.toString()}`);
      }
    }, 400); // 400ms delay for live search

    return () => clearTimeout(delayDebounceFn);
  }, [search, router, searchParams]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full md:w-80">
      <input
        type="text"
        placeholder="Search by name, email, or mobile..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
      />
      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
      <button type="submit" className="hidden">Search</button>
    </form>
  );
}
