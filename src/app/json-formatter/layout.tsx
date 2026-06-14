import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Secure JSON Formatter & Validator',
  description: 'Format, validate, and beautify your JSON data securely in your browser. Fast local processing, no data leaves your device.',
  keywords: ['json formatter', 'json validator', 'beautify json', 'parse json', 'secure json formatter', 'khatahisab tools'],
  openGraph: {
    title: 'Secure JSON Formatter & Validator - KhataHisab Tools',
    description: 'Format, validate, and beautify your JSON data securely in the browser.',
    url: 'https://tools.khatahisab.in/json-formatter',
  },
};

export default function JsonFormatterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
