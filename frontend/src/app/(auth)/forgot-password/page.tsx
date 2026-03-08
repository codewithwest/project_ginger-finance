'use client';

import { useState } from 'react';
import { graphqlFetch } from '@/lib/graphql';
import { Mail, ArrowRight, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await graphqlFetch({
        query: `mutation { forgotPassword(email: "${email.replace(/"/g, '')}") { success } }`,
      });
      if (res.errors?.length) throw new Error(res.errors[0].message as string);
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

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
        <div style={{ textAlign: 'center' }}>
          <h1 className="gradient-text" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Forgot Password
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        {sent ? (
          <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ 
              width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(72, 187, 120, 0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
            }}>
              <Check size={24} color="#48bb78" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Check your inbox</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              If an account exists for <strong>{email}</strong>, a reset link has been sent.
            </p>
            <Link href="/login" className="btn-primary" style={{ textDecoration: 'none', justifyContent: 'center' }}>
              Back to Sign In
            </Link>
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {error && (
                <div style={{ 
                  padding: '0.75rem', borderRadius: '8px', background: 'rgba(252, 129, 129, 0.1)',
                  border: '1px solid rgba(252, 129, 129, 0.2)', color: '#fc8181', fontSize: '0.875rem' 
                }}>
                  {error}
                </div>
              )}
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={evt => setEmail(evt.target.value)}
                    placeholder="you@example.com"
                    className="form-input"
                    style={{ paddingLeft: '2.75rem' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
              >
                {loading ? 'Sending...' : <><ArrowRight size={18} /> Send Reset Link</>}
              </button>

              <div style={{ textAlign: 'center' }}>
                <Link href="/login" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>
                  Back to login
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
