import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free AI Background Remover',
  description: 'Remove background from images instantly using local AI. 100% private, no server uploads, and download in Free HD quality.',
  keywords: ['background remover', 'bg remover', 'remove background', 'free image background remover', 'local AI bg remover', 'khatahisab tools'],
  openGraph: {
    title: 'Free AI Background Remover - KhataHisab Tools',
    description: 'Remove background from images instantly using local AI. 100% private, no server uploads.',
    url: 'https://tools.khatahisab.in/bg-remover',
  },
};

export default function BgRemoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
