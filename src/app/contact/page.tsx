import { Mail, Phone, MapPin, Send, Building2 } from "lucide-react";

export const metadata = {
  title: "Contact Us | KhataHisab Tools",
  description: "Get in touch with KhataHisab Tools. We're here to help you with our free AI and utility tools.",
};

export default function ContactPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 md:py-20">
      
      {/* Header */}
      <div className="mb-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-6">
          <Mail className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Get in Touch</h1>
        <p className="text-slate-500 font-medium max-w-xl mx-auto text-lg">
          Have a question about our tools or need support? We'd love to hear from you. Drop us a message below!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
        {/* Contact Information */}
        <div className="bg-slate-900 rounded-[32px] p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] pointer-events-none -ml-20 -mb-20"></div>
          
          <div className="relative z-10 h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
            
            <div className="space-y-8 flex-1">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                  <Building2 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-medium mb-1">Company</p>
                  <p className="text-lg font-bold">Madhav mayur mart LLP</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                  <Phone className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-medium mb-1">Phone</p>
                  <a href="tel:+919346037211" className="text-lg font-bold hover:text-emerald-400 transition-colors">
                    +91 93460 37211
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                  <Mail className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-medium mb-1">Email</p>
                  <a href="mailto:support@khatahisab.in" className="text-lg font-bold hover:text-rose-400 transition-colors">
                    support@khatahisab.in
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <h3 className="font-bold mb-2">Our Promise</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                We process all your files locally. We will never ask for your passwords or sensitive personal documents. 100% Privacy Guaranteed.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Send us a Message</h2>
          
          <form className="space-y-6" action="mailto:support@khatahisab.in" method="GET" encType="text/plain">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-bold text-slate-700">Your Name</label>
              <input 
                type="text" 
                id="name" 
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                placeholder="John Doe"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-bold text-slate-700">Subject</label>
              <input 
                type="text" 
                id="subject"
                name="subject" 
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                placeholder="How can we help you?"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="body" className="text-sm font-bold text-slate-700">Message</label>
              <textarea 
                id="body"
                name="body" 
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-400 resize-none"
                placeholder="Write your message here..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-blue-500/25"
            >
              Send Message <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
