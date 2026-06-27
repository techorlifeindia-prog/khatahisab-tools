import { RefreshCcw, Gift, CreditCard, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Refund Policy | KhataHisab Tools",
  description: "Refund Policy for KhataHisab Tools by Madhav mayur mart LLP.",
};

export default function RefundPolicyPage() {
  const lastUpdated = "June 27, 2026";

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 md:py-16">
      
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 text-rose-600 mb-6">
          <RefreshCcw className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Refund Policy</h1>
        <p className="text-slate-500 font-medium">Last updated: {lastUpdated}</p>
      </div>

      {/* Content */}
      <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-6 md:p-10 space-y-8 text-slate-600">
        
        <section className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-4">
            <Gift className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Our Tools are Currently 100% Free!</h2>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto">
            At this time, all AI and utility tools provided by <strong>KhataHisab Tools</strong> are completely free to use. We do not charge any subscription fees or one-time payments for accessing our current suite of tools.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            1. No Payments Collected
          </h2>
          <p className="leading-relaxed">
            Because our services are currently offered free of charge, we do not collect any payment information (such as credit card details, UPI, or bank accounts) from our users. Therefore, <strong>no refunds are applicable or necessary</strong> at this moment.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">2. Future Premium Services</h2>
          <p className="leading-relaxed">
            If <strong>Madhav mayur mart LLP</strong> decides to introduce premium, paid features or subscription plans in the future, we will update this Refund Policy to clearly outline the terms, conditions, and processes for requesting a refund for those specific paid services. Any changes will be communicated clearly before you make a purchase.
          </p>
        </section>

        <section className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-slate-600" />
            3. Contact Us
          </h2>
          <p className="leading-relaxed mb-4">
            If you have any questions or concerns regarding our policies, please feel free to reach out to our support team:
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
