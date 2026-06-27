"use client";

import { useAgeCalculator } from "./useAgeCalculator";
import { Calendar, Clock, Heart, CalendarDays } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";
import { Suspense, useEffect, useState } from "react";

// [TL-AGE-F-01: Age Calculator Page]
export default function AgeCalculatorPage() {
  return (
    <Suspense fallback={<div className="w-full min-h-[400px] flex items-center justify-center text-slate-400 font-medium">Loading Calculator...</div>}>
      <AgeCalculatorContent />
    </Suspense>
  );
}

function AgeCalculatorContent() {
  const { dob, setDob, currentDate, setCurrentDate, result } = useAgeCalculator();
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(`${window.location.origin}${window.location.pathname}?dob=${dob}&currentDate=${currentDate}`);
    }
  }, [dob, currentDate]);

  return (
    <div className="w-full max-w-4xl mx-auto overflow-hidden px-2 pb-10">
      
      {/* Main App Card */}
      <div className="bg-white rounded-[24px] border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative overflow-hidden mt-4 md:mt-6">
        
        {/* Top Gradient Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500"></div>

        <div className="p-4 sm:p-5 md:p-6 relative z-10">
          
          {/* Share Button (Top Right) */}
          <div className="absolute top-4 right-4 sm:top-5 sm:right-5">
            <ShareButton 
              title="Age Calculator - Find your exact age in seconds!" 
              text="⏳ Check out this superfast age calculator that calculates your exact age in years, months, days, hours, and even seconds! 👇"
              url={dob ? shareUrl : undefined}
            />
          </div>

          {/* COMPACT App-Style Header */}
          <div className="flex items-center gap-3 sm:gap-4 mb-6 md:mb-8 mt-1 pr-16">
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 tracking-tight leading-tight">Age Calculator</h1>
              <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">
                Calculate your exact age perfectly.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
            {/* Input Section */}
            <div className="md:col-span-5 space-y-5 h-fit border-b md:border-b-0 md:border-r border-slate-100 pb-8 md:pb-0 md:pr-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3.5 md:py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 hover:bg-slate-100/50 focus:bg-white transition-all text-slate-900 font-bold shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Current Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <CalendarDays className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="date"
                    value={currentDate}
                    onChange={(e) => setCurrentDate(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3.5 md:py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 hover:bg-slate-100/50 focus:bg-white transition-all text-slate-900 font-bold shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Result Section */}
            <div className="md:col-span-7 space-y-6">
              {result ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Main Age Output */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
                    <div className="p-4 sm:p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200 text-center transform transition-transform hover:scale-105 border border-indigo-400/50">
                      <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-1 md:mb-2">{result.years}</div>
                      <div className="text-indigo-100 font-bold text-xs sm:text-sm md:text-base uppercase tracking-wider">Years</div>
                    </div>
                    <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200 text-center transform transition-transform hover:scale-105 border border-blue-400/50">
                      <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-1 md:mb-2">{result.months}</div>
                      <div className="text-blue-100 font-bold text-xs sm:text-sm md:text-base uppercase tracking-wider">Months</div>
                    </div>
                    <div className="p-4 sm:p-6 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl text-white shadow-lg shadow-sky-200 text-center transform transition-transform hover:scale-105 border border-sky-400/50">
                      <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-1 md:mb-2">{result.days}</div>
                      <div className="text-sky-100 font-bold text-xs sm:text-sm md:text-base uppercase tracking-wider">Days</div>
                    </div>
                  </div>

                  {/* Extra Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform">
                      <div className="p-3.5 bg-white text-indigo-600 rounded-xl shadow-sm border border-indigo-100">
                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mb-0.5">Total Months</div>
                        <div className="font-black text-lg sm:text-xl text-slate-800">
                          {result.totalMonths.toLocaleString()} <span className="text-xs font-bold text-slate-400">months</span>
                          {result.totalMonthsDaysRemaining > 0 && <span className="text-sm font-bold text-slate-600 ml-1">{result.totalMonthsDaysRemaining} <span className="text-xs font-bold text-slate-400">days</span></span>}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform">
                      <div className="p-3.5 bg-white text-purple-600 rounded-xl shadow-sm border border-purple-100">
                        <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mb-0.5">Total Weeks</div>
                        <div className="font-black text-lg sm:text-xl text-slate-800">
                          {result.totalWeeks.toLocaleString()} <span className="text-xs font-bold text-slate-400">weeks</span>
                          {result.totalWeeksDaysRemaining > 0 && <span className="text-sm font-bold text-slate-600 ml-1">{result.totalWeeksDaysRemaining} <span className="text-xs font-bold text-slate-400">days</span></span>}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform">
                      <div className="p-3.5 bg-white text-emerald-600 rounded-xl shadow-sm border border-emerald-100">
                        <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mb-0.5">Total Days</div>
                        <div className="font-black text-lg sm:text-xl text-slate-800">{result.totalDays.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform">
                      <div className="p-3.5 bg-white text-amber-600 rounded-xl shadow-sm border border-amber-100">
                        <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mb-0.5">Total Hours</div>
                        <div className="font-black text-lg sm:text-xl text-slate-800">{result.totalHours.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform">
                      <div className="p-3.5 bg-white text-orange-600 rounded-xl shadow-sm border border-orange-100">
                        <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mb-0.5">Total Minutes</div>
                        <div className="font-black text-lg sm:text-xl text-slate-800">{result.totalMinutes.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform">
                      <div className="p-3.5 bg-white text-red-600 rounded-xl shadow-sm border border-red-100">
                        <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mb-0.5">Total Seconds</div>
                        <div className="font-black text-lg sm:text-xl text-slate-800">{result.totalSeconds.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="sm:col-span-2 p-4 sm:p-5 bg-pink-50/50 rounded-2xl border border-pink-100 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform">
                      <div className="p-3.5 bg-white text-pink-600 rounded-xl shadow-sm border border-pink-200">
                        <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-pink-100" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-pink-500 uppercase tracking-wider mb-0.5">Next Birthday In</div>
                        <div className="font-black text-lg sm:text-xl text-pink-700">{result.nextBirthdayDays} <span className="text-sm font-bold text-pink-500">days</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center p-6 text-center bg-indigo-50/50 rounded-2xl border-2 border-dashed border-indigo-200 text-indigo-600">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-500">
                    <CalendarDays className="w-8 h-8" />
                  </div>
                  <h3 className="font-black text-lg text-slate-800 mb-1">Waiting for details</h3>
                  <p className="font-medium text-[13px] md:text-sm text-slate-500 max-w-[250px]">
                    Please select your Date of Birth on the left to calculate your exact age.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SEO Article Section */}
      <article className="mt-12 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm text-slate-600">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-4">How is Age Calculated?</h2>
        <div className="space-y-4 text-sm md:text-base leading-relaxed">
          <p>
            The age of a person can be counted differently in different cultures. This calculator is based on the most common age system used in most western countries. In this system, age increases on a person's birthday. For example, the age of a person who has lived for 3 years and 11 months is 3, and their age will increase to 4 on their next birthday one month later.
          </p>
          <p>
            In some cultures, age is expressed by counting years with or without including the current year. For example, a person who is twenty years old is the same age as another person who is in their twenty-first year of life. In traditional Chinese age systems, people are born at age 1 and their age increases at the Traditional Chinese New Year rather than their birthday.
          </p>
          <p>
            In some situations, the months and days result of this age calculator may be confusing, especially when the starting date is the end of a month. For example, we count Feb. 20 to Mar. 20 to be one month. However, there are two ways to calculate the age from Feb. 28 to Mar. 31. If we consider Feb. 28 to Mar. 28 to be one month, then the result is one month and 3 days. If we consider both Feb. 28 and Mar. 31 as the end of the month, then the result is exactly one month. Both calculation results are reasonable. Our calculator uses the most standard and accurate method to prevent confusion caused by the uneven number of days in different months.
          </p>
        </div>
      </article>
    </div>
  );
}
