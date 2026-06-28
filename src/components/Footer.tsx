import Link from "next/link";
import { Mail, ShieldCheck, ChevronRight, Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#0B0F19] border-t border-slate-800/50 mt-auto relative z-10 overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6 md:pt-12 md:pb-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Company Info */}
          <div className="md:col-span-5 lg:col-span-4">
            <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity mb-4">
              <img src="/logo.svg" alt="KhataHisab Logo" className="w-8 h-8 object-contain" />
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight text-white">Khata<span className="text-red-500">Hisab</span></span>
                <span className="bg-blue-600/20 text-blue-400 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest border border-blue-500/20">Tools</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-3 max-w-sm font-medium">
              Empowering businesses and individuals with fast, secure, and fully local AI & Utility tools. <span className="text-slate-300">No server uploads, 100% privacy guaranteed.</span>
            </p>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-start gap-2.5 text-sm text-slate-400 bg-slate-800/30 px-3 py-2.5 rounded-xl border border-slate-800/50 backdrop-blur-sm w-max">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="font-medium leading-tight text-xs">Powered by <br/><span className="text-white font-bold text-sm">Madhav mayur mart LLP</span></span>
              </div>
              <div className="flex flex-col gap-1.5">
                <a href="tel:+919346037211" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors font-medium">
                  <span className="w-4 h-4 flex items-center justify-center shrink-0">📞</span>
                  +91 93460 37211
                </a>
                <a href="mailto:support@khatahisab.in" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors font-medium">
                  <Mail className="w-4 h-4 shrink-0" />
                  support@khatahisab.in
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 lg:col-span-2 lg:col-start-7">
            <h3 className="font-bold text-white mb-6 uppercase text-xs tracking-widest flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-blue-500" /> Quick Links
            </h3>
            <ul className="space-y-4">
              {[
                { name: 'Home', path: '/' },
                { name: 'AI Business Booster', path: '/business-booster' },
                { name: 'Age Calculator', path: '/age-calculator' },
                { name: 'Background Remover', path: '/bg-remover' },
                { name: 'PDF Magic', path: '/pdf-magic' },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.path} className="group flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-all font-medium">
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Policies */}
          <div className="md:col-span-4 lg:col-span-3">
            <h3 className="font-bold text-white mb-6 uppercase text-xs tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Legal
            </h3>
            <ul className="space-y-4">
              {[
                { name: 'Privacy Policy', path: '/privacy-policy' },
                { name: 'Terms of Service', path: '/terms-of-service' },
                { name: 'Refund Policy', path: '/refund-policy' },
                { name: 'Contact Us', path: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.path} className="group flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-all font-medium">
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 font-medium text-center md:text-left">
            &copy; {new Date().getFullYear()} <span className="text-slate-300 font-bold">Madhav mayur mart LLP</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium bg-slate-800/30 px-4 py-2 rounded-full border border-slate-800/50">
            Built with ⚡ Speed & Privacy in India
          </div>
        </div>
      </div>
    </footer>
  );
}
