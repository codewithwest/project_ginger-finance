'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  User,
  ChevronRight,
  Leaf,
} from 'lucide-react';

const navigationItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/assets', label: 'Assets', icon: Package },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: '240px',
      minHeight: '100vh',
      background: 'var(--color-bg-secondary)',
      borderRight: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1rem',
      position: 'fixed',
      top: 0,
      left: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2.5rem', padding: '0 0.5rem' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #4fa3e0, #38b2ac)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Leaf size={18} color="white" />
        </div>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }} className="gradient-text">
          Ginger Finance
        </span>
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1 }}>
        {navigationItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link key={href} href={href} className={`nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} />
              <span style={{ flex: 1 }}>{label}</span>
              {isActive && <ChevronRight size={14} style={{ opacity: 0.6 }} />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '0.75rem 0.5rem',
        borderTop: '1px solid var(--color-border)',
        color: 'var(--color-text-muted)',
        fontSize: '0.75rem',
      }}>
        Ginger Finance v0.1.0
      </div>
    </aside>
  );
}
