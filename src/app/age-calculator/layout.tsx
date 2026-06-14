import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Exact Age Calculator',
  description: 'Calculate your exact age in days, months, and years instantly. Simple, fast, and free online age calculator.',
  keywords: ['age calculator', 'exact age calculator', 'calculate age in days', 'dob calculator', 'khatahisab tools'],
  openGraph: {
    title: 'Exact Age Calculator - KhataHisab Tools',
    description: 'Calculate your exact age in days, months, and years instantly.',
    url: 'https://tools.khatahisab.in/age-calculator',
  },
};

export default function AgeCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
