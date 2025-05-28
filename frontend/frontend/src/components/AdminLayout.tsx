import type { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">Kafetalog Admin Panel</header>
      <main className="p-6 flex-1 bg-gray-100">{children}</main>
    </div>
  );
}
