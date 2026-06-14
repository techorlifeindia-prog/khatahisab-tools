import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Word & Character Counter',
  description: 'Count words, characters, sentences, and check keyword density in real-time. A simple and fast text analysis tool.',
  keywords: ['word counter', 'character counter', 'keyword density', 'text analysis tool', 'free word counter', 'khatahisab tools'],
  openGraph: {
    title: 'Free Word & Character Counter - KhataHisab Tools',
    description: 'Count words, characters, and check keyword density in real-time.',
    url: 'https://tools.khatahisab.in/word-counter',
  },
};

export default function WordCounterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
