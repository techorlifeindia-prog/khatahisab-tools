import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Smart QR Code Generator',
  description: 'Generate high-quality QR codes for URLs, Text, Wi-Fi, WhatsApp, and more. Customize colors and design. Free and instantly downloadable.',
  keywords: ['qr code generator', 'create qr code', 'free qr code', 'wifi qr code', 'whatsapp qr code', 'khatahisab tools'],
  openGraph: {
    title: 'Smart QR Code Generator - KhataHisab Tools',
    description: 'Generate customized high-quality QR codes for Links, Wi-Fi, WhatsApp & more.',
    url: 'https://tools.khatahisab.in/qr-generator',
  },
};

export default function QrGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
