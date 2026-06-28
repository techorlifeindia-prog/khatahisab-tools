// [TL-DASHBOARD-01: Dashboard Page]
'use client';

import { Store, Star, MessageSquare, Loader2, CheckCircle2, AlertCircle, LogOut, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useSession, signIn, signOut } from "next-auth/react";
import { useReviews } from '@/hooks/useReviews';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const {
    reviews,
    locationName,
    isLoadingReviews,
    apiError,
    isReplyingBulk,
    replyingId,
    progress,
    toastMessage,
    handleBulkReply,
    handleSingleReply,
    unrepliedCount
  } = useReviews();

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-black text-white text-lg shadow-sm border border-red-500">
              K
            </div>
            <span className="font-black text-xl tracking-tight text-slate-800">KhataHisab <span className="text-blue-600 text-xs bg-blue-100 px-1.5 py-0.5 rounded-full">PRO</span></span>
          </Link>
          <div className="flex items-center gap-4">
            {status === 'loading' ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            ) : session ? (
              <>
                <span className="text-sm font-medium text-slate-600">{session.user?.name || 'User'}</span>
                {session.user?.image ? (
                  <img src={session.user.image} alt="User" className="w-8 h-8 rounded-full border border-slate-200" />
                ) : (
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {session.user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <button onClick={() => signOut()} className="ml-2 p-2 text-slate-400 hover:text-red-500 transition-colors" title="Logout">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button 
                onClick={() => signIn('google')} 
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
              >
                <LogIn className="w-4 h-4" /> Login with Google
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {!session ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-black text-slate-800 mb-4">Connect Your Google Business Profile</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">Please login with Google to view and manage your real business reviews using our AI automation.</p>
            <button 
              onClick={() => signIn('google')} 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 text-white px-8 py-3 rounded-xl text-base font-bold shadow-md transition-all"
            >
              <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Login with Google
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your Google Business Profile & AI Automation</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-bold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" /> Connected to Google
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 text-slate-500 mb-2 font-semibold text-sm">
              <Store className="w-5 h-5 text-blue-500" /> Active Location
            </div>
            <div className="text-xl font-bold text-slate-800">{locationName}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 text-slate-500 mb-2 font-semibold text-sm">
              <Star className="w-5 h-5 text-amber-500" /> Average Rating
            </div>
            <div className="text-2xl font-black text-slate-800">
              {reviews.length > 0 ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1) : "0.0"} 
              <span className="text-sm text-slate-500 font-medium ml-2">({reviews.length} Reviews)</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 bg-red-50/50 border-red-100">
            <div className="flex items-center gap-3 text-red-500 mb-2 font-semibold text-sm">
              <AlertCircle className="w-5 h-5" /> Action Required
            </div>
            <div className="text-2xl font-black text-red-600">{unrepliedCount} <span className="text-sm text-red-400 font-medium">Unanswered Reviews</span></div>
          </div>
        </div>

        {apiError && (
          <div className="mb-8 bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 flex items-center gap-3 font-semibold">
            <AlertCircle className="w-5 h-5" /> {apiError}
          </div>
        )}

        {/* Review Manager */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" /> 
                Review Inbox
              </h2>
              <p className="text-sm text-slate-500 mt-1">AI will automatically generate and post appropriate replies.</p>
            </div>
            <button 
              onClick={handleBulkReply}
              disabled={isReplyingBulk || unrepliedCount === 0}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-md ${
                unrepliedCount === 0 ? 'bg-slate-300 cursor-not-allowed' :
                isReplyingBulk ? 'bg-blue-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105'
              }`}
            >
              {isReplyingBulk ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Replying... {progress}%</>
              ) : unrepliedCount === 0 ? (
                <><CheckCircle2 className="w-4 h-4" /> All Caught Up</>
              ) : (
                <>🚀 1-Click Reply All ({unrepliedCount})</>
              )}
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {isLoadingReviews ? (
              <div className="p-12 flex flex-col items-center justify-center text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
                <p className="font-semibold text-slate-700">Syncing live data from Google...</p>
                <p className="text-sm mt-1">Fetching your latest reviews and ratings.</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="p-12 text-center text-slate-500 font-semibold">No reviews found.</div>
            ) : reviews.map((review) => (
              <div key={review.id} className="p-6 transition-colors hover:bg-slate-50/50">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800">{review.author}</span>
                    <div className="flex items-center gap-1 text-amber-500 my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-500' : 'fill-slate-200 text-slate-200'}`} />
                      ))}
                      <span className="text-xs text-slate-400 ml-2">{review.time}</span>
                    </div>
                  </div>
                  {review.replied ? (
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Replied by AI
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">
                      Needs Reply
                    </span>
                  )}
                </div>
                <p className="mt-3 text-slate-600 text-sm">{review.text}</p>
                {!review.replied && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleSingleReply(review.id)}
                      disabled={replyingId === review.id || isReplyingBulk}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {replyingId === review.id ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Generating AI Reply...</>
                      ) : (
                        <><MessageSquare className="w-4 h-4" /> Reply with AI</>
                      )}
                    </button>
                  </div>
                )}
                {review.replied && (
                  <div className="mt-4 bg-slate-50 border border-slate-200 p-4 rounded-xl relative">
                    <div className="absolute -top-2.5 left-4 bg-slate-50 px-2 text-[10px] font-bold text-blue-600 tracking-wider uppercase border border-slate-200 rounded-full">Owner Reply</div>
                    <p className="text-sm text-slate-700 italic">"{review.rawReply?.comment || "Thank you for your feedback! We always strive to provide the best experience."}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        </>
        )}
      </main>

      {/* Modern Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-[bounce_0.5s_ease-out]">
          <div className="bg-slate-900 text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 font-medium border border-slate-700">
            <div className="bg-emerald-500/20 text-emerald-400 p-1 rounded-full">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
}
