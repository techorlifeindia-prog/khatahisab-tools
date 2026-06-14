# M3Bharat Tools Website - 10/10 Master Architecture & Rules

Whenever you are working on the **M3Bharat Tools** project, you MUST strictly follow these rules. This is the SINGLE source of truth for all logic and operations to ensure no future developer faces any issues.

---

### 1. 🌐 URL & SEO Strategy (Subdirectory Niyam)
* **Subdirectory, Not Subdomain:** Tools MUST be built as subdirectories (e.g., `m3bharat.com/free-pdf-converter`) rather than subdomains. 
* **Tool Hub Homepage:** The main `/` route serves as a "Tool Hub" where all tools are categorized.
* **SEO First:** Semantic HTML (H1, Main tags) and proper Next.js Meta tags are mandatory for every tool page.

### 2. 💻 Technology Stack & Typing
* **Next.js App Router:** The project is built on Next.js 15 (App Router).
* **Strict TypeScript:** Using `any` is strictly prohibited. Every piece of data/props must have a defined interface or type.
* **ESM Mode:** Use modern ES Module imports only.

### 3. 🏗️ Architecture (Feature-First)
* Group code by features (tools) rather than technical layers.
* Each tool gets its own directory under `src/app/`, e.g., `src/app/age-calculator/`.
* **Logic-UI Separation:** UI files (e.g., `page.tsx`) must be clean and presentational. All heavy logic must be moved to custom hooks (e.g., `useAgeCalculator.ts`).

### 4. 🎨 UI/UX & Design Rules (Premium Aesthetics)
* **Vibrant Royal Blue Theme:** The default primary theme color is Blue (`#2563eb` light, `#3b82f6` dark).
* **Glassmorphism:** Use soft shadows (`shadow-sm`, `shadow-md`), white/glassy backgrounds, and borderless floating inputs to create a modern feel.
* **Zero Placeholder Policy:** Never use "Lorem Ipsum" or generic stock images. Always use real content and data.
* **Fluid & Adaptive UI:** Design must be fully responsive (Mobile, Tablet, Desktop) using Tailwind.

### 5. 🧠 Performance & Micro-Animations
* **Performance First:** Heavy libraries should be lazy-loaded using Next.js `dynamic()`.
* **Animations:** Use `framer-motion` for smooth interactions, page transitions, and hover states.
* **Mouse-Less Logic:** Important tools should be accessible via keyboard (Tab/Enter).

### 6. 🏷️ TL-Series Tagging Niyam (Mandatory)
Similar to OR-Series, every major logic block and file MUST be tagged for easy navigation:
* **File Level Tag:** `// [TL-<TOOL_CODE>-F-<SERIAL>: Description]` (e.g., `// [TL-AGE-F-01: Age Calculator Page]`)
* **Logic Level Tag:** `// [TL-<TOOL_CODE>-H-<SERIAL>: Description]` (e.g., `// [TL-AGE-H-01: Calculate Age Hook]`)

---

**[STRICT ENFORCEMENT]**: These rules are sacred. Adhering to them ensures the codebase remains premium, fast, and scalable.
