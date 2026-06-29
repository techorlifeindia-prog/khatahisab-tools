import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { Mail, Phone, ShieldCheck, Trash2, Calendar, Shield, Power, Edit2, CheckCircle2, XCircle, MoreVertical } from "lucide-react";
import SearchForm from "./SearchForm";
import Pagination from "./Pagination";
import Link from "next/link";
import DeleteButton from "./DeleteButton";
import EditUserModal from "./EditUserModal";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await getServerSession(authOptions);
  
  // Security Check: Only allow techorlifeindia@gmail.com and demo account
  if (!session || (session.user?.email !== "techorlifeindia@gmail.com" && session.user?.email !== "demo@khatahisab.in")) {
    redirect("/");
  }

  // Resolve search parameters
  const resolvedParams = await searchParams;
  const search = typeof resolvedParams.search === 'string' ? resolvedParams.search : "";
  const pageParam = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page) : 1;
  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const limit = 10;

  // Toggle User Status Server Action
  async function toggleUserStatus(formData: FormData) {
    "use server";
    const userId = formData.get("userId") as string;
    const currentStatus = formData.get("currentStatus") as string;
    if (!userId) return;

    const currentSession = await getServerSession(authOptions);
    if (!currentSession || (currentSession.user?.email !== "techorlifeindia@gmail.com" && currentSession.user?.email !== "demo@khatahisab.in")) {
      return;
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Prevent toggling admin accounts
    const targetUser = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (targetUser && (targetUser.email === "techorlifeindia@gmail.com" || targetUser.email === "demo@khatahisab.in")) {
      return; 
    }

    const newStatus = currentStatus === "inactive" ? "active" : "inactive";
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { status: newStatus } }
    );
    revalidatePath("/admin/users");
  }

  // Build MongoDB query
  const query: any = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { mobile: { $regex: search, $options: "i" } }
    ];
  }

  // Fetch users from MongoDB
  const client = await clientPromise;
  const db = client.db();
  
  const totalUsers = await db.collection("users").countDocuments(query);
  const totalPages = Math.ceil(totalUsers / limit);
  
  const users = await db.collection("users")
    .find(query)
    .sort({ _id: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500">Manage your registered users ({totalUsers} total)</p>
          </div>
        </div>
        
        {/* Search Form */}
        <SearchForm />
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="w-full overflow-x-auto max-h-[calc(100vh-200px)] overflow-y-auto">
          <table className="w-full text-left border-collapse min-w-[800px] relative">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50 shadow-sm border-b border-slate-200">
                <th className="p-4 font-semibold text-slate-600 text-sm">User</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Contact</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Role</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Status</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Joined</th>
                <th className="p-4 font-semibold text-slate-600 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user) => {
                const isAdmin = user.email === "techorlifeindia@gmail.com" || user.email === "demo@khatahisab.in";
                const status = user.status || "active";
                const isInactive = status === "inactive";
                const joinedDate = user._id.getTimestamp().toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
                
                return (
                  <tr key={user._id.toString()} className="hover:bg-slate-50/50 transition-colors group/row">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.image || "/logo.svg"} 
                          alt={user.name || "User"} 
                          className="w-10 h-10 rounded-full bg-slate-100 object-cover border border-slate-200" 
                        />
                        <div>
                          <span className="font-medium text-slate-900 block">{user.name || "Unknown"}</span>
                          <span className="text-xs font-mono text-slate-400" title={user._id.toString()}>
                            ID: {user._id.toString().substring(0, 8)}...
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5 text-slate-600 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        {user.mobile && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                            <span>{user.mobile}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {isAdmin ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                          <Shield className="w-3 h-3" /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200">
                          User
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        isInactive 
                          ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }`}>
                        {isInactive ? <XCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        {isInactive ? 'Inactive' : 'Active'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {joinedDate}
                      </div>
                    </td>
                    <td className="p-4 text-right relative">
                      {!isAdmin && (
                        <div className="relative inline-block text-left z-20">
                          <button 
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors peer focus:outline-none"
                            title="Actions"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          
                          {/* 3-dot Dropdown Menu */}
                          <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-2xl border border-slate-100 shadow-xl opacity-0 invisible peer-focus:opacity-100 peer-focus:visible hover:opacity-100 hover:visible transition-all flex flex-col p-1.5 gap-1">
                            
                            {/* Edit Button */}
                            <EditUserModal 
                              user={{
                                _id: user._id.toString(),
                                name: user.name || "",
                                email: user.email || "",
                                mobile: user.mobile || ""
                              }} 
                            />

                            {/* Active / Deactive Toggle Button */}
                            <form action={toggleUserStatus}>
                              <input type="hidden" name="userId" value={user._id.toString()} />
                              <input type="hidden" name="currentStatus" value={status} />
                              <button 
                                type="submit"
                                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${
                                  isInactive 
                                    ? 'text-emerald-600 hover:bg-emerald-50' 
                                    : 'text-amber-600 hover:bg-amber-50'
                                }`}
                              >
                                <Power className="w-4 h-4" />
                                <span>{isInactive ? "Activate" : "Suspend"}</span>
                              </button>
                            </form>

                            <div className="h-px bg-slate-100 my-0.5 mx-2"></div>

                            {/* Delete Button */}
                            <DeleteButton userId={user._id.toString()} />

                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No users found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination totalPages={totalPages} currentPage={page} />
        </div>
      </div>
    </div>
  );
}
