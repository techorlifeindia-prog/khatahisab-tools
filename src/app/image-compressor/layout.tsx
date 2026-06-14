import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Image Compressor',
  description: 'Compress JPG, PNG, and WEBP images locally without uploading to any server. Reduce file size without losing quality.',
  keywords: ['image compressor', 'compress image', 'reduce image size', 'free image compressor', 'local image compression', 'khatahisab tools'],
  openGraph: {
    title: 'Free Image Compressor - KhataHisab Tools',
    description: 'Compress images locally without uploading to any server.',
    url: 'https://tools.khatahisab.in/image-compressor',
  },
};

export default function ImageCompressorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
