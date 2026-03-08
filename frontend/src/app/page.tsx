'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Leaf, ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';
import Dashboard from '@/components/dashboard/Dashboard';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  if (!mounted) return null;

  if (user) {
    return <Dashboard />;
  }

  return <LandingPage />;
}

function LandingPage() {
  return (
    <div className="landing-container">
      {/* 3D Animated Background Elements */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      
      {/* Hero Section */}
      <section className="hero">
        <nav className="nav-container">
          <div className="logo-section">
            <div className="logo-box">
              <Leaf size={24} color="white" />
            </div>
            <span className="logo-text gradient-text">Ginger Finance</span>
          </div>
          <div className="nav-links">
            <Link href="/login" className="btn-ghost">Sign In</Link>
            <Link href="/login" className="btn-primary">Get Started</Link>
          </div>
        </nav>

        <div className="hero-content">
          <div className="hero-text-side">
            <h1 className="hero-title">
              Manage Your Farm Finances in <span className="gradient-text">3D Perspective</span>
            </h1>
            <p className="hero-description">
              The ultimate command center for modern agriculture. Track assets, visualize growth, 
              and master your cash flow with precision.
            </p>
            <div className="hero-actions">
              <Link href="/login" className="btn-primary-lg">
                Enter Dashboard <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
              </Link>
              <button className="btn-ghost-lg">View Features</button>
            </div>
          </div>

          <div className="hero-visual-side">
            {/* Real 3D Elements can be added here, currently CSS 3D */}
            <div className="floating-scene">
              <div className="card-3d card-main">
                <div className="card-inner">
                  <div className="card-header">
                    <TrendingUp size={20} color="#68d391" />
                    <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>Balance</span>
                  </div>
                  <div className="card-value">R 54,230</div>
                  <div className="card-footer">
                    <div className="mini-chart">
                      <div className="bar" style={{ height: '40%' }}></div>
                      <div className="bar" style={{ height: '70%' }}></div>
                      <div className="bar" style={{ height: '50%' }}></div>
                      <div className="bar" style={{ height: '90%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-3d card-sub-1">
                <div className="card-inner" style={{ alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Shield size={24} color="#4fa3e0" />
                  <span style={{ fontWeight: 600 }}>Secure Vault</span>
                </div>
              </div>

              <div className="card-3d card-sub-2">
                <div className="card-inner" style={{ alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Zap size={24} color="#f6ad55" />
                  <span style={{ fontWeight: 600 }}>Quick Add</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
