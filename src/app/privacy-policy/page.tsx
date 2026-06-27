import { ShieldCheck, Lock, EyeOff } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | KhataHisab Tools",
  description: "Privacy Policy for KhataHisab Tools by Madhav mayur mart LLP. We process your files locally with 100% privacy.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "June 27, 2026";

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 md:py-16">
      
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Privacy Policy</h1>
        </div>
        <div className="text-sm text-slate-500 font-medium bg-slate-100/80 px-3 py-1.5 rounded-lg w-max">
          Updated: {lastUpdated}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-6 md:p-10 space-y-8 text-slate-600">
        
        <section>
          <p className="text-lg leading-relaxed">
            Welcome to <strong>KhataHisab Tools</strong>, operated by <strong>Madhav mayur mart LLP</strong> ("we", "our", or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains our practices regarding your data when you use our website and tools (https://tools.khatahisab.in).
          </p>
        </section>

        <section className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600" />
            1. Our 100% Local Processing Guarantee
          </h2>
          <p className="leading-relaxed">
            The core philosophy behind KhataHisab Tools is absolute privacy. When you use our media and document tools (such as Image Compressor, PDF Magic, and Background Remover), <strong>your files are processed entirely locally in your browser.</strong>
          </p>
          <ul className="list-disc pl-5 mt-4 space-y-2 text-slate-700">
            <li>We <strong>do not</strong> upload your files to our servers.</li>
            <li>We <strong>do not</strong> store, view, or analyze your documents or images.</li>
            <li>All processing happens directly on your device using local computing power.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">2. Information We Collect</h2>
          <p className="leading-relaxed mb-4">
            Because our tools run locally, we collect very minimal information:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Analytics Data:</strong> We use basic analytics services (such as Vercel Analytics) to track general website usage, page views, and performance. This data is anonymized and does not identify you personally.</li>
            <li><strong>Voluntary Information:</strong> If you contact us via email (support@khatahisab.in) for support, we will collect your email address and any information you provide in your message to assist you.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">3. Cookies and Tracking Technologies</h2>
          <p className="leading-relaxed">
            We may use cookies or similar tracking technologies to enhance your experience, remember your preferences (like theme or settings), and understand how our website is used. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">4. Third-Party Services</h2>
          <p className="leading-relaxed">
            Our website is hosted on modern cloud infrastructure (such as Vercel or Hostinger) which may collect standard access logs (IP address, user agent, timestamps) for security and operational purposes. We do not integrate with third-party advertising trackers that sell your data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">5. Changes to This Privacy Policy</h2>
          <p className="leading-relaxed">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>

        <section className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-slate-600" />
            6. Contact Us
          </h2>
          <p className="leading-relaxed mb-4">
            If you have any questions or concerns about this Privacy Policy or our practices regarding your privacy, please contact us at:
          </p>
          <div className="text-slate-700 font-medium space-y-1">
            <p><strong>Company:</strong> Madhav mayur mart LLP</p>
            <p><strong>Phone:</strong> <a href="tel:+919346037211" className="text-blue-600 hover:underline">+91 93460 37211</a></p>
            <p><strong>Email:</strong> <a href="mailto:support@khatahisab.in" className="text-blue-600 hover:underline">support@khatahisab.in</a></p>
          </div>
        </section>

      </div>
    </div>
  );
}
