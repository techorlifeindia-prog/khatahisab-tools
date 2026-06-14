---
description: Master Workspace Rules and Project Logic (Niyam)
---

# 📜 M3BHARAT TOOLS - MASTER RULES (SABHI NIYAM EK SAATH)

Whenever you are working on the **M3Bharat Tools** project, you MUST strictly follow these rules. This is the SINGLE source of truth for all logic and operations.

---

### 1. 🔒 THE HYBRID ARCHITECTURE (SECURITY FIRST) NIYAM
- **Zone 1 (100% Offline & Secure)**: Tools that process personal or sensitive data (e.g., Aadhaar, PAN, Bank Statements, E-commerce Shipping Labels, Passwords, Personal Photos) MUST be executed entirely offline inside the browser. No server uploads. We must uphold our "100% Secure & Local" promise.
- **Zone 2 (Cloud / Server-Powered)**: Only use backend/server processing for tasks that mathematically or logically require a server (e.g., Domain WHOIS, Heavy AI Processing, Heavy OCR, cracking encrypted files). Any cloud tool MUST have a clear user disclaimer: "Your file/data is temporarily uploaded to our secure servers and deleted instantly."

---

### 2. 🎨 PREMIUM UI & AESTHETICS (WOW FACTOR)
- **Glassmorphism & Gradients**: Use vibrant gradient backgrounds (e.g., `bg-gradient-to-br from-rose-500 to-purple-600`, `indigo-600 to blue-600`) paired with highly translucent white containers (`bg-white/60 backdrop-blur-xl border border-white/80`).
- **Rounded Edges & Micro-Animations**: Use `rounded-3xl` for main cards and `rounded-2xl` for internal elements. Apply `transition-all`, `hover:-translate-y-1`, and `hover:shadow-[color]` for an interactive feel.
- **Iconography**: Use `lucide-react` icons uniformly.
- **Mobile Perfection**: The UI must never have horizontal scrolling. Always test and apply mobile-first Tailwind classes (`w-full px-2`, `sm:px-4`, stacked layouts using `flex-col` on mobile).

---

### 3. 🔍 THE "STRICT PERMISSION" PROTOCOL (ANUMATI NIYAM)
- **NO UNSOLICITED INVESTIGATION:** Do NOT view files, search the codebase, or check logs without first asking the user.
- **NO CROSS-TOOL EDITS:** If fixing "Age Calculator", do NOT touch the code of "JSON Formatter" or "PDF Magic" without explicit permission.

---

### 🏗️ CORE ARCHITECTURE & LOGIC (DEVELOPMENT RULES)
1. **Next.js App Router**: Use React Server Components where possible, but use `"use client"` directive at the top of interactive tool pages.
2. **Logic Co-location**: Keep the tool's business logic extracted into a custom hook (e.g., `usePdfMagic.ts`) and keep the `page.tsx` strictly presentational.
3. **Strict TypeScript**: No `any` type allowed unless absolutely unavoidable (like casting binary blobs). Always define interfaces for component props and state.
4. **Mandatory TL-Series Tagging**: Every tool file MUST have unique tags for easy global searching.
   - Example UI: `// [TL-PDF-MAGIC-01: PDF Magic Page]`
   - Example Logic: `// [TL-PDF-MAGIC-02: usePdfMagic Hook]`
5. **No Placeholders**: Never use dummy images. Build real functional code.

**[STRICT ENFORCEMENT]**: These rules are sacred for M3Bharat Tools. Any violation will lead to rework and bugs.
