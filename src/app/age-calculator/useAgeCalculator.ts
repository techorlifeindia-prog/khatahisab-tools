import { useState, useMemo } from 'react';

// [TL-AGE-H-01: Age Calculation Logic]
export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalWeeksDaysRemaining: number;
  totalMonths: number;
  totalMonthsDaysRemaining: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  nextBirthdayDays: number | null;
}

export function useAgeCalculator() {
  const [dob, setDob] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const calculateAge = useMemo((): AgeResult | null => {
    if (!dob || !currentDate) return null;

    const start = new Date(dob);
    const end = new Date(currentDate);

    if (start > end) return null; // Invalid

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const timeDiff = end.getTime() - start.getTime();
    const totalDays = Math.floor(timeDiff / (1000 * 3600 * 24));
    
    const totalWeeks = Math.floor(totalDays / 7);
    const totalWeeksDaysRemaining = totalDays % 7;
    
    const totalMonths = years * 12 + months;
    const totalMonthsDaysRemaining = days;

    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    // Next Birthday calculation
    const currentYearBirthday = new Date(start);
    currentYearBirthday.setFullYear(end.getFullYear());
    
    let nextBday = currentYearBirthday;
    if (currentYearBirthday < end) {
      nextBday.setFullYear(end.getFullYear() + 1);
    }
    
    const nextBirthdayDays = Math.ceil(
      (nextBday.getTime() - end.getTime()) / (1000 * 3600 * 24)
    );

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalWeeksDaysRemaining,
      totalMonths,
      totalMonthsDaysRemaining,
      totalHours,
      totalMinutes,
      totalSeconds,
      nextBirthdayDays,
    };
  }, [dob, currentDate]);

  return {
    dob,
    setDob,
    currentDate,
    setCurrentDate,
    result: calculateAge,
  };
}
