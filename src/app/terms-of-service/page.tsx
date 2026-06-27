import { FileText, CheckCircle2, AlertTriangle, Scale } from "lucide-react";

export const metadata = {
  title: "Terms of Service | KhataHisab Tools",
  description: "Terms of Service and usage conditions for KhataHisab Tools by Madhav mayur mart LLP.",
};

export default function TermsOfServicePage() {
  const lastUpdated = "June 27, 2026";

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 md:py-16">
      
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-6">
          <FileText className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Terms of Service</h1>
        <p className="text-slate-500 font-medium">Last updated: {lastUpdated}</p>
      </div>

      {/* Content */}
      <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-6 md:p-10 space-y-8 text-slate-600">
        
        <section>
          <p className="text-lg leading-relaxed">
            Welcome to <strong>KhataHisab Tools</strong> (https://tools.khatahisab.in). By accessing or using our website and tools, you agree to be bound by these Terms of Service. These Terms apply to all visitors, users, and others who access or use the Service, which is operated by <strong>Madhav mayur mart LLP</strong>.
          </p>
        </section>

        <section className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
            1. Use License
          </h2>
          <p className="leading-relaxed mb-4">
            We grant you a personal, non-exclusive, non-transferable, limited privilege to enter and use our free web-based utility tools. Under this license you may not:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li>Modify or copy the underlying materials or source code.</li>
            <li>Use the tools for any illegal, malicious, or unauthorized purpose.</li>
            <li>Attempt to decompile or reverse engineer any software contained on the website.</li>
            <li>Remove any copyright or other proprietary notations from the materials.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">2. Local Processing & Data</h2>
          <p className="leading-relaxed">
            Many of our tools (such as Image Compressor, PDF Magic, Background Remover) run entirely in your web browser. This means <strong>we do not upload, store, or have access to the files you process.</strong> Consequently, you are solely responsible for ensuring you have the legal right to process the files you choose to upload to the browser interface. We are not liable for any copyright infringement or illegal content processed locally on your device.
          </p>
        </section>

        <section className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100">
          <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            3. Disclaimer of Warranties
          </h2>
          <p className="leading-relaxed">
            The materials and tools on KhataHisab Tools are provided on an 'as is' basis. <strong>Madhav mayur mart LLP</strong> makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. We do not warrant that the tools will be completely error-free or uninterrupted.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">4. Limitations of Liability</h2>
          <p className="leading-relaxed">
            In no event shall <strong>Madhav mayur mart LLP</strong> or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the tools on KhataHisab Tools, even if we or our authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">5. Revisions and Errata</h2>
          <p className="leading-relaxed">
            The materials appearing on the website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its website are accurate, complete, or current. We may make changes to the materials contained on its website at any time without notice.
          </p>
        </section>

        <section className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Scale className="w-5 h-5 text-slate-600" />
            6. Governing Law & Contact
          </h2>
          <p className="leading-relaxed mb-4">
            These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of India.
          </p>
          <div className="text-slate-700 font-medium space-y-1">
            <p>If you have any questions regarding these Terms, you may contact us at:</p>
            <p className="mt-2"><strong>Company:</strong> Madhav mayur mart LLP</p>
            <p><strong>Phone:</strong> <a href="tel:+919346037211" className="text-blue-600 hover:underline">+91 93460 37211</a></p>
            <p><strong>Email:</strong> <a href="mailto:support@khatahisab.in" className="text-blue-600 hover:underline">support@khatahisab.in</a></p>
          </div>
        </section>

      </div>
    </div>
  );
}
