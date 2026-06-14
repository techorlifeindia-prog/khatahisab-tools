"use client";

import { useAgeCalculator } from "./useAgeCalculator";
import { Calendar, Clock, Heart, CalendarDays } from "lucide-react";

// [TL-AGE-F-01: Age Calculator Page]
export default function AgeCalculatorPage() {
  const { dob, setDob, currentDate, setCurrentDate, result } = useAgeCalculator();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 md:space-y-10 overflow-hidden px-1">
      {/* Header */}
      <div className="text-center space-y-3 md:space-y-4">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 break-words">
          Age Calculator
        </h1>
        <p className="text-slate-600 text-sm sm:text-base md:text-lg font-medium max-w-lg mx-auto w-full px-2">
          Calculate your exact age in years, months, and days perfectly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="md:col-span-5 p-4 md:p-6 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4 md:space-y-6 h-fit">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Date of Birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-white/60 bg-white/80 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Current Date
            </label>
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-white/60 bg-white/80 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Result Section */}
        <div className="md:col-span-7 space-y-6">
          {result ? (
            <>
              {/* Main Age Output */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl text-white shadow-lg text-center transform transition-transform hover:scale-105">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1 md:mb-2">{result.years}</div>
                  <div className="text-blue-100 font-medium text-xs sm:text-sm md:text-base">Years</div>
                </div>
                <div className="p-4 sm:p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl text-white shadow-lg text-center transform transition-transform hover:scale-105">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1 md:mb-2">{result.months}</div>
                  <div className="text-indigo-100 font-medium text-xs sm:text-sm md:text-base">Months</div>
                </div>
                <div className="p-4 sm:p-6 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl text-white shadow-lg text-center transform transition-transform hover:scale-105">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1 md:mb-2">{result.days}</div>
                  <div className="text-sky-100 font-medium text-xs sm:text-sm md:text-base">Days</div>
                </div>
              </div>

              {/* Extra Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-4 hover:-translate-y-1 transition-transform">
                  <div className="p-3.5 bg-blue-100 text-blue-600 rounded-xl shadow-sm">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-500">Total Months</div>
                    <div className="font-extrabold text-xl text-slate-800">{result.totalMonths.toLocaleString()}</div>
                  </div>
                </div>
                <div className="p-5 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-4 hover:-translate-y-1 transition-transform">
                  <div className="p-3.5 bg-purple-100 text-purple-600 rounded-xl shadow-sm">
                    <CalendarDays className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-500">Total Weeks</div>
                    <div className="font-extrabold text-xl text-slate-800">{result.totalWeeks.toLocaleString()}</div>
                  </div>
                </div>
                <div className="p-5 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-4 hover:-translate-y-1 transition-transform">
                  <div className="p-3.5 bg-green-100 text-green-600 rounded-xl shadow-sm">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-500">Total Days</div>
                    <div className="font-extrabold text-xl text-slate-800">{result.totalDays.toLocaleString()}</div>
                  </div>
                </div>
                <div className="p-5 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-4 hover:-translate-y-1 transition-transform">
                  <div className="p-3.5 bg-pink-100 text-pink-600 rounded-xl shadow-sm">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-500">Next Birthday In</div>
                    <div className="font-extrabold text-xl text-slate-800">{result.nextBirthdayDays} days</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full min-h-[150px] md:min-h-[200px] flex flex-col items-center justify-center p-4 md:p-6 text-center bg-white/40 backdrop-blur-xl rounded-3xl border-2 border-dashed border-slate-300 text-slate-500">
              <CalendarDays className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4 text-blue-400 opacity-50" />
              <p className="font-medium text-sm sm:text-base md:text-lg text-slate-600 px-2 w-full">Please select your Date of Birth to calculate your exact age.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
