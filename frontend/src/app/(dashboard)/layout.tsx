import Sidebar from '@/components/layout/Sidebar';
import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{
        marginLeft: '240px',
        flex: 1,
        padding: '2rem',
        background: 'var(--color-bg-primary)',
      }}>
        {children}
      </main>
    </div>
  );
}
