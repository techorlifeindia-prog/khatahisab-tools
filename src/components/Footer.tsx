import Link from "next/link";
import { Mail, MapPin, ExternalLink, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Company Info */}
          <div className="md:col-span-5 lg:col-span-4">
            <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity mb-4">
              <img src="/logo.svg" alt="KhataHisab Logo" className="w-8 h-8 object-contain" />
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">Khata<span className="text-red-600">Hisab</span></span>
                <span className="bg-blue-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">Tools</span>
              </div>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Empowering businesses and individuals with fast, secure, and fully local AI & Utility tools. No server uploads, 100% privacy guaranteed.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="font-medium">Powered by <br/><span className="text-slate-900 font-bold">Madhav mayur mart LLP</span></span>
              </div>
              <a href="mailto:support@khatahisab.in" className="flex items-center gap-3 text-sm text-slate-600 hover:text-blue-600 transition-colors">
                <Mail className="w-5 h-5 text-slate-400 shrink-0" />
                <span>support@khatahisab.in</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 lg:col-span-2 lg:col-start-7">
            <h3 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Home</Link></li>
              <li><Link href="/business-booster" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">AI Business Booster</Link></li>
              <li><Link href="/age-calculator" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Age Calculator</Link></li>
              <li><Link href="/bg-remover" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Background Remover</Link></li>
              <li><Link href="/pdf-magic" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">PDF Magic</Link></li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div className="md:col-span-4 lg:col-span-3">
            <h3 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-wider">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy-policy" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund-policy" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Refund Policy</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400 font-medium text-center md:text-left">
            &copy; {new Date().getFullYear()} <span className="text-slate-600 font-bold">Madhav mayur mart LLP</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
            Built with ⚡ Speed & Privacy in India
          </div>
        </div>
      </div>
    </footer>
  );
}
