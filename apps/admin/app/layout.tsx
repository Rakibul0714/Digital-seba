import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Digital Seba — Office Dashboard', description: 'Union Parishad Office Management' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
