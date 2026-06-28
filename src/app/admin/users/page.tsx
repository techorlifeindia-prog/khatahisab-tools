import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { Mail, ShieldCheck } from "lucide-react";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  
  // Security Check: Only allow techorlifeindia@gmail.com and demo account
  if (!session || (session.user?.email !== "techorlifeindia@gmail.com" && session.user?.email !== "demo@khatahisab.in")) {
    redirect("/");
  }

  // Fetch users from MongoDB
  const client = await clientPromise;
  const db = client.db();
  const users = await db.collection("users").find({}).sort({ _id: -1 }).toArray();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500">Manage your registered users ({users.length} total)</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 font-semibold text-slate-600 text-sm">User</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Email</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user) => (
                <tr key={user._id.toString()} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.image || "/logo.svg"} 
                        alt={user.name || "User"} 
                        className="w-10 h-10 rounded-full bg-slate-100 object-cover border border-slate-200" 
                      />
                      <span className="font-medium text-slate-900">{user.name || "Unknown"}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-4 h-4 text-slate-400" />
                      {user.email}
                    </div>
                  </td>
                  <td className="p-4 text-xs font-mono text-slate-400">
                    {user._id.toString()}
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
