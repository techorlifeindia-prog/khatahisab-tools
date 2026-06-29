"use client";

import { Mail, Phone, MapPin, Send, Building2, CheckCircle2, Settings } from "lucide-react";
import { useState } from "react";

// metadata must be in a separate file or layout since this is a client component now.
// For simplicity, we can just remove metadata export here or move it to layout.
// Since contact is a simple page, removing metadata from here and letting global handle it is fine.

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      mobile: formData.get("mobile"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setIsSuccess(true);
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setIsSuccess(false), 5000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 md:py-20">
      
      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Get in Touch</h1>
          </div>
        </div>
        <p className="text-slate-500 font-medium text-sm sm:text-base">
          Have a question about our tools or need support? Drop us a message below!
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
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {isSuccess && (
              <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl border border-emerald-200 flex items-center gap-3 font-medium">
                <CheckCircle2 className="w-5 h-5" />
                Message sent successfully! We will get back to you soon.
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-bold text-slate-700">Your Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="mobile" className="text-sm font-bold text-slate-700">Mobile Number</label>
                <input 
                  type="tel" 
                  id="mobile" 
                  name="mobile"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-bold text-slate-700">Subject</label>
              <input 
                type="text" 
                id="subject"
                name="subject" 
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                placeholder="How can we help you?"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="body" className="text-sm font-bold text-slate-700">Message</label>
              <textarea 
                id="body"
                name="message" 
                rows={5}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-400 resize-none"
                placeholder="Write your message here..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-2 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'}`}
            >
              {isSubmitting ? <><Settings className="w-5 h-5 animate-spin"/> Sending...</> : <>Send Message <Send className="w-4 h-4" /></>}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
