import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF Magic - Merge & Compress PDFs',
  description: 'Securely merge, organize, and compress PDF files locally on your device. 100% private, no server uploads needed.',
  keywords: ['pdf magic', 'merge pdf', 'compress pdf', 'organize pdf', 'local pdf tool', 'free pdf tool', 'khatahisab tools'],
  openGraph: {
    title: 'PDF Magic - Secure Local PDF Tools',
    description: 'Securely merge and organize PDF files locally without server uploads.',
    url: 'https://tools.khatahisab.in/pdf-magic',
  },
};

export default function PdfMagicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
