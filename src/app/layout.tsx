import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Anaconda Data Science Platform',
  description: 'Cloud-native data science platform with Jupyter, MLflow, and model registry'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}