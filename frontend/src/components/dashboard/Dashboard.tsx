'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { graphqlFetch } from '@/lib/graphql';
import { GET_DASHBOARD_DATA } from '@/graphql/queries/dashboard';
import Financial3DMap from '@/components/dashboard/Financial3DMap';
import { Wallet, TrendingUp, ArrowDownRight, ArrowUpRight, Plus, Box, RefreshCw } from 'lucide-react';
import AddTransactionModal from './AddTransactionModal';
import Sidebar from './Sidebar';
import TransactionsView from '@/views/TransactionsView';
import AssetsView from '@/views/AssetsView';
import SavingsView from '@/views/SavingsView';
import HouseholdSettingsView from '@/components/household/HouseholdSettingsView';

interface Transaction {
  _id: string;
  type: 'income' | 'expense' | 'savings';
  amount: number;
  date: string;
  description: string;
  tags: string[];
}

interface Asset {
  _id: string;
  name: string;
  category: string;
  purchasePrice: number;
  currentValue: number;
  purchaseDate: string;
}

interface SavingsAccount {
  _id: string;
  accountName: string;
  accountType: string;
  balance: number;
  currency: string;
}

interface DashboardData {
  me: { _id: string; username: string; email: string };
  myAssets: Asset[];
  mySavingsAccounts: SavingsAccount[];
  myTransactions: Transaction[];
}

export default function Dashboard({ userId }: { userId: string }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.reload();
  };

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const result = await graphqlFetch<DashboardData>({
        query: GET_DASHBOARD_DATA,
        variables: { userId },
      });

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch dashboard data'));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [userId, fetchData]);

  const stats = useMemo(() => {
    if (!data) return { netWorth: 0, totalAssets: 0, totalSavings: 0 };
    const totalAssets = data.myAssets.reduce((sum: number, asset: Asset) => sum + asset.currentValue, 0);
    const totalSavings = data.mySavingsAccounts.reduce((sum: number, account: SavingsAccount) => sum + account.balance, 0);

    return {
      netWorth: totalAssets + totalSavings,
      totalAssets,
      totalSavings,
    };
  }, [data]);

  if (loading) return (
    <div className="loader-container">
      <div className="loader-3d"></div>
    </div>
  );
  
  const renderActiveView = () => {
    if (error) return (
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', margin: '2rem' }}>
        <h2 style={{ color: '#ef4444' }}>Error loading dashboard</h2>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()} className="btn-primary" style={{ margin: '1rem auto' }}>
          Retry
        </button>
      </div>
    );

    switch (activeTab) {
      case 'transactions':
        return <TransactionsView userId={userId} />;
      case 'assets':
        return <AssetsView userId={userId} />;
      case 'savings':
        return <SavingsView userId={userId} />;
      case 'household':
        return <HouseholdSettingsView />;
      default:
        return (
          <>
            <header className="dashboard-header">
              <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
                  Welcome back, <span className="gradient-text">{data?.me?.username || 'User'}</span>
                </h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Here is your farm&apos;s financial overview.</p>
              </div>
              <div className="header-actions" style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => fetchData()} className="btn-ghost-sm" title="Refresh Data">
                  <RefreshCw size={18} />
                </button>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                  <Plus size={18} /> Add Transaction
                </button>
              </div>
            </header>

            <div className="stats-grid">
              <div className="glass-card stat-card">
                <div className="stat-icon" style={{ background: 'rgba(79, 163, 224, 0.15)' }}>
                  <Wallet size={24} color="#4fa3e0" />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Net Worth</span>
                  <span className="stat-value">R {stats.netWorth.toLocaleString()}</span>
                </div>
              </div>

              <div className="glass-card stat-card">
                <div className="stat-icon" style={{ background: 'rgba(56, 178, 172, 0.15)' }}>
                  <Box size={24} color="#38b2ac" />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Total Assets</span>
                  <span className="stat-value">R {stats.totalAssets.toLocaleString()}</span>
                </div>
              </div>

              <div className="glass-card stat-card">
                <div className="stat-icon" style={{ background: 'rgba(104, 211, 145, 0.15)' }}>
                  <TrendingUp size={24} color="#68d391" />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Total Savings</span>
                  <span className="stat-value">R {stats.totalSavings.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="dashboard-main-grid">
              <div className="visual-section glass-card" style={{ padding: '1.5rem' }}>
                <div className="card-header">
                  <h3 style={{ fontWeight: 700 }}>Interactive Asset Map</h3>
                  <span className="badge">3D PERSPECTIVE</span>
                </div>
                <Financial3DMap assets={data?.myAssets || []} />
              </div>

              <div className="transactions-section glass-card" style={{ padding: '1.5rem' }}>
                <div className="card-header">
                  <h3 style={{ fontWeight: 700 }}>Recent Transactions</h3>
                  <button className="btn-ghost-sm" onClick={() => setActiveTab('transactions')}>View All</button>
                </div>
                <div className="transaction-list">
                  {(data?.myTransactions || []).slice(0, 5).map((transaction: Transaction) => (
                    <div key={transaction._id} className="transaction-item">
                      <div className={`item-icon ${transaction.type}`}>
                        {transaction.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                      </div>
                      <div className="item-details">
                        <span className="item-name">{transaction.description}</span>
                        <span className="history-date" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{new Date(transaction.date).toLocaleDateString()}</span>
                      </div>
                      <span className={`item-amount ${transaction.type}`}>
                        {transaction.type === 'income' ? '+' : '-'} R {transaction.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  {(!data?.myTransactions || data.myTransactions.length === 0) && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                      No transactions yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="dashboard-layout-wrapper">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      <main className="dashboard-main-content">
        {renderActiveView()}
      </main>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => fetchData()} 
        userId={userId} 
      />

      <style jsx>{`
        .dashboard-layout-wrapper {
          display: flex;
          min-height: 100vh;
          background-color: var(--color-bg-primary);
        }
        .dashboard-main-content {
          flex: 1;
          padding: 2rem 3rem;
          max-width: 1600px;
          margin: 0 auto;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          overflow-x: hidden;
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .stat-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
        }
        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-info {
          display: flex;
          flex-direction: column;
        }
        .stat-label {
          color: var(--color-text-muted);
          font-size: 0.875rem;
          font-weight: 500;
        }
        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
        }
        .dashboard-main-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }
        @media (max-width: 1024px) {
          .dashboard-main-grid {
            grid-template-columns: 1fr;
          }
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .badge {
          background: var(--color-accent-primary);
          color: white;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }
        .transaction-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .transaction-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          border-radius: 12px;
          transition: background 0.2s;
        }
        .transaction-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        .item-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .item-icon.income { background: rgba(104, 211, 145, 0.15); color: var(--color-income); }
        .item-icon.expense { background: rgba(239, 68, 68, 0.15); color: var(--color-expense); }
        .item-icon.savings { background: rgba(79, 163, 224, 0.15); color: var(--color-accent-primary); }
        .item-details {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .item-name { font-weight: 600; font-size: 0.95rem; }
        .item-date { font-size: 0.8rem; color: var(--color-text-muted); }
        .item-amount { font-weight: 700; }
        .item-amount.income { color: var(--color-income); }
        .item-amount.expense { color: var(--color-expense); }
        .item-amount.savings { color: var(--color-accent-primary); }
      `}</style>
    </div>
  );
}
