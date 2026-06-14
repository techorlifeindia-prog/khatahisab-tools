# KhataHisab - 10/10 Master Architecture & Rules

Whenever you are working on the **KhataHisab** project, you MUST strictly follow these rules. This is the SINGLE source of truth for all logic and operations to ensure no future developer faces any issues.

---

### 1. 🔒 THE HYBRID ARCHITECTURE (SECURITY FIRST) NIYAM
* **Zone 1 (100% Offline & Secure)**: Tools that process personal or sensitive data (e.g., Aadhaar, PAN, Bank Statements, E-commerce Shipping Labels, Passwords, Personal Photos) MUST be executed entirely offline inside the browser. No server uploads. We must uphold our "100% Secure & Local" promise.
* **Zone 2 (Cloud / Server-Powered)**: Only use backend/server processing for tasks that mathematically or logically require a server (e.g., Domain WHOIS, Heavy AI Processing, Heavy OCR). Any cloud tool MUST have a clear user disclaimer: "Your file/data is temporarily uploaded to our secure servers and deleted instantly."

### 2. 🌐 URL & SEO Strategy (Subdirectory Niyam)
* **Subdirectory, Not Subdomain:** Tools MUST be built as subdirectories (e.g., `khatahisab.in/free-pdf-converter`) rather than subdomains. 
* **Tool Hub Homepage:** The main `/` route serves as a "Business & Tool Hub" where all features are categorized.
* **SEO First:** Semantic HTML (H1, Main tags) and proper Next.js Meta tags are mandatory for every tool page.

### 3. 💻 Technology Stack & Typing
* **Next.js App Router:** The project is built on Next.js 15 (App Router). Use React Server Components where possible, but use `"use client"` directive at the top of interactive tool pages.
* **Strict TypeScript:** Using `any` is strictly prohibited. Every piece of data/props must have a defined interface or type.
* **ESM Mode:** Use modern ES Module imports only.

### 4. 🏗️ Architecture & Logic (Development Rules)
* Group code by features (tools) rather than technical layers. Each tool gets its own directory under `src/app/`.
* **Logic-UI Separation:** UI files (e.g., `page.tsx`) must be clean and presentational. All heavy business logic must be moved to custom hooks (e.g., `usePdfMagic.ts`).
* **No Placeholders:** Never use dummy images or "Lorem Ipsum". Build real functional code.

### 5. 🎨 Premium UI & Aesthetics (WOW Factor)
* **Glassmorphism & Gradients:** Use vibrant gradient backgrounds paired with highly translucent white containers (`bg-white/60 backdrop-blur-xl border border-white/80`).
* **Rounded Edges & Micro-Animations:** Use `rounded-3xl` for main cards and `rounded-2xl` for internal elements. Apply `transition-all`, `hover:-translate-y-1`, and `hover:shadow-[color]` for an interactive feel.
* **Iconography:** Use `lucide-react` icons uniformly.
* **Fluid & Adaptive UI:** Design must be fully responsive. No horizontal scrolling. Mobile-first Tailwind classes (`w-full px-2`, stacked layouts).

### 6. 🔍 THE "STRICT PERMISSION" PROTOCOL (ANUMATI NIYAM)
* **NO UNSOLICITED INVESTIGATION:** Do NOT view files, search the codebase, or check logs without first asking the user.
* **NO CROSS-TOOL EDITS:** If fixing "Age Calculator", do NOT touch the code of "JSON Formatter" or "PDF Magic" without explicit permission.

### 7. 🏷️ TL-Series Tagging Niyam (Mandatory)
Every major logic block and file MUST be tagged for easy navigation:
* **File Level Tag:** `// [TL-<TOOL_CODE>-F-<SERIAL>: Description]` (e.g., `// [TL-PDF-MAGIC-01: PDF Magic Page]`)
* **Logic Level Tag:** `// [TL-<TOOL_CODE>-H-<SERIAL>: Description]` (e.g., `// [TL-PDF-MAGIC-02: usePdfMagic Hook]`)

---

**[STRICT ENFORCEMENT]**: These rules are sacred for KhataHisab. Adhering to them ensures the codebase remains premium, fast, secure, and scalable. Any violation will lead to rework and bugs.
