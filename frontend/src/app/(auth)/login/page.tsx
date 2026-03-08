'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf, Eye, EyeOff, LogIn } from 'lucide-react';
import { graphqlFetch } from '@/lib/graphql';
import { LOGIN_MUTATION } from '@/graphql/mutations/auth';

interface LoginResponse {
  login: {
    accessToken: string;
    user: {
      _id: string;
      username: string;
      email: string;
      role: string;
    };
  };
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await graphqlFetch<LoginResponse>({
        query: LOGIN_MUTATION,
        variables: { email: formData.email, password: formData.password },
      });


      if (result.errors) {
        setError(result.errors[0].message);
        
        return;
      }

      const { login } = result.data;
      localStorage.setItem('token', login.accessToken);
      localStorage.setItem('user', JSON.stringify(login.user));
      router.push('/');
    } catch (err) {
      console.error('LoginPage - error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-bg-primary)', padding: '1.5rem',
      backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(79,163,224,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(56,178,172,0.06) 0%, transparent 60%)',
    }}>
      <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Logo */}
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
            <h1 className="gradient-text" style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.04em' }}>
              Ginger Finance
            </h1>
            <p className="auth-description">
              Manage your farm&apos;s financial health with precision. 
              Log in to access your dashboard.
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '1.5rem' }}>Sign in to your account</h2>

          {error && (
            <div style={{ 
              marginBottom: '1rem', padding: '0.75rem', borderRadius: '8px', 
              background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#ef4444', fontSize: '0.875rem' 
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                Email
              </label>
              <input
                className="form-input"
                type="email"
                placeholder="west@gingerfinance.app"
                value={formData.email}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  style={{ paddingRight: '3rem' }}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
              style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }}
            >
              {isLoading ? 'Signing in...' : <><LogIn size={16} /> Sign In</>}
            </button>

            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              <a
                href="/forgot-password"
                style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}
                onMouseOver={evt => (evt.currentTarget.style.color = '#10b981')}
                onMouseOut={evt => (evt.currentTarget.style.color = 'var(--color-text-muted)')}
              >
                Forgot password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
