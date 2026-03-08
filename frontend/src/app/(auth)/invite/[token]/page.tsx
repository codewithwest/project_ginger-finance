'use client';

import InviteForm from '@/components/auth/InviteForm';
import { useParams } from 'next/navigation';
import { Leaf } from 'lucide-react';

export default function InviteRegistrationPage() {
  const params = useParams();
  const token = params.token as string;

  const layoutStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--color-bg-primary)',
    padding: '1.5rem',
    backgroundImage: 'radial-gradient(ellipse at 50% 50%, rgba(79,163,224,0.08) 0%, transparent 70%)',
  };

  return (
    <main style={layoutStyle}>
      <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #4fa3e0, #38b2ac)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(79,163,224,0.35)',
          }}>
            <Leaf size={26} color="white" />
          </div>
          <div>
            <h1 className="gradient-text" style={{ fontSize: '1.75rem', fontWeight: 800 }}>
              Join Household
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Create your account to accept the invitation.
            </p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '2.5rem' }}>
          {token ? (
            <InviteForm token={token} />
          ) : (
            <div style={{ 
              textAlign: 'center', padding: '1.5rem', borderRadius: '12px', 
              background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.2)',
              color: '#fbbf24', fontSize: '0.9rem' 
            }}>
              Invalid or missing invitation token.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
