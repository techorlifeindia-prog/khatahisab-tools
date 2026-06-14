import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Local Business Booster AI',
  description: 'Automate your Local SEO, Google Business Profile management, review replies, and social media posts using powerful AI. 100% Free for businesses.',
  keywords: ['local seo tool', 'google business profile ai', 'review replier', 'ai post generator', 'local marketing ai', 'khatahisab tools'],
  openGraph: {
    title: 'Local Business Booster AI - KhataHisab Tools',
    description: 'Grow your local business instantly with AI-powered GBP scanning, review replying, and social media generation.',
    url: 'https://tools.khatahisab.in/business-booster',
  },
};

export default function BusinessBoosterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
