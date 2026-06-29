import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { Mail, Calendar, Trash2, User, Phone } from "lucide-react";
import DeleteMessageButton from "./DeleteMessageButton";



export default async function AdminMessagesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const client = await clientPromise;
  const db = client.db("khatahisab");
  
  // Fetch messages sorted by latest first
  const rawMessages = await db.collection("contact_messages").find({}).sort({ createdAt: -1 }).toArray();
  
  // Convert MongoDB ObjectId to string so it can be passed to client components
  const messages = rawMessages.map(msg => ({
    _id: msg._id.toString(),
    name: msg.name,
    mobile: msg.mobile,
    subject: msg.subject,
    message: msg.message,
    createdAt: msg.createdAt,
    status: msg.status
  }));

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
          <Mail className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Inbox</h1>
          <p className="text-sm font-medium text-slate-500">View messages from the Contact Form</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <Mail className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">No Messages Yet</h3>
            <p className="text-slate-500 mt-1">When users contact you, their messages will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {messages.map((msg) => (
              <div key={msg._id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600">
                      <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg text-slate-700">
                        <User className="w-4 h-4 text-blue-500" />
                        <span className="font-bold">{msg.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg text-slate-700">
                        <Phone className="w-4 h-4 text-emerald-500" />
                        <span className="font-bold">{msg.mobile}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Calendar className="w-4 h-4" />
                        {new Date(msg.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">{msg.subject}</h3>
                      <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center md:items-start shrink-0">
                    <DeleteMessageButton id={msg._id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
