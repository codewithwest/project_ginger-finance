'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { graphqlFetch } from '@/lib/graphql';
import { Lock, ArrowRight, Check, AlertCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await graphqlFetch<{ resetPassword: { success: boolean } }>({
        query: `
          mutation ResetPassword($token: String!, $password: String!) {
            resetPassword(token: $token, password: $password) { success }
          }
        `,
        variables: { token, password },
      });

      if (!res.data?.resetPassword?.success) {
        throw new Error('Reset link is invalid or has expired');
      }

      setSuccess(true);
      setTimeout(() => { router.push('/login'); }, 2000);
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

  if (!token) {
    return (
      <main style={layoutStyle}>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: '#fc8181' }}>
          <AlertCircle size={48} style={{ marginBottom: '1rem', opacity: 0.8 }} />
          <p>Invalid or missing reset token.</p>
        </div>
      </main>
    );
  }

  return (
    <main style={layoutStyle}>
      <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 className="gradient-text" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Set New Password
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            Choose a strong password for your account.
          </p>
        </div>

        {success ? (
          <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ 
              width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(72, 187, 120, 0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
            }}>
              <Check size={24} color="#48bb78" />
            </div>
            <p style={{ color: '#48bb78', fontWeight: 700 }}>Password updated!</p>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Redirecting you to sign in...
            </p>
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {error && (
                <div style={{ 
                  padding: '0.75rem', borderRadius: '8px', background: 'rgba(252, 129, 129, 0.1)',
                  border: '1px solid rgba(252, 129, 129, 0.2)', color: '#fc8181', fontSize: '0.875rem' 
                }}>
                  {error}
                </div>
              )}

              {[
                { id: 'password', label: 'New Password', val: password, set: setPassword },
                { id: 'confirm', label: 'Confirm Password', val: confirm, set: setConfirm },
              ].map(field => (
                <div key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                    {field.label}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input
                      type="password"
                      required
                      value={field.val}
                      onChange={evt => field.set(evt.target.value)}
                      placeholder="••••••••"
                      className="form-input"
                      style={{ paddingLeft: '2.75rem' }}
                    />
                  </div>
                </div>
              ))}

              <button
                type="submit"
                disabled={loading || !password || !confirm}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem' }}
              >
                {loading ? 'Updating...' : <><ArrowRight size={18} /> Update Password</>}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
