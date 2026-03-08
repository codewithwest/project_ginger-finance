'use client';

import React, { useState, useEffect } from 'react';
import { graphqlFetch } from '@/lib/graphql';
import { PiggyBank, History, Landmark, Plus, TrendingUp } from 'lucide-react';
import AddSavingsAccountModal from '@/components/dashboard/AddSavingsAccountModal';
import AddTransactionModal from '@/components/dashboard/AddTransactionModal';

interface SavingsAccount {
  _id: string;
  accountName: string;
  accountType: string;
  balance: number;
  currency: string;
}

interface Transaction {
  _id: string;
  description: string;
  amount: number;
  date: string;
  type: string;
}

export default function SavingsView() {
  const [accounts, setAccounts] = useState<SavingsAccount[]>([]);
  const [history, setHistory] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const query = `
        query GetSavingsData {
          mySavingsAccounts {
            _id
            accountName
            accountType
            balance
            currency
          }
          myTransactions(type: "savings") {
            _id
            description
            amount
            date
            type
          }
        }
      `;
      const result = await graphqlFetch<{ 
        mySavingsAccounts: SavingsAccount[], 
        myTransactions: Transaction[] 
      }>({
        query,
      });
      if (result.data) {
        setAccounts(result.data.mySavingsAccounts);
        setHistory(result.data.myTransactions || []);
      }
    } catch (err) {
      console.error('Failed to fetch savings data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalSavings = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const savingsGoal = 500000;
  const progressPercent = Math.min(100, (totalSavings / savingsGoal) * 100);

  if (loading) return (
    <div className="loader-container">
      <div className="loader-3d"></div>
    </div>
  );

  return (
    <div className="view-container">
      <header className="view-header">
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <PiggyBank className="gradient-text" size={32} />
            Savings & Investments
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Growth and accumulation of your financial reserves.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-ghost" onClick={() => setIsAccountModalOpen(true)}>New Account</button>
          <button className="btn-primary" onClick={() => setIsContributionModalOpen(true)}>
            <Plus size={18} /> New Contribution
          </button>
        </div>
      </header>

      <AddSavingsAccountModal 
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onSuccess={fetchData}
      />

      <AddTransactionModal 
        isOpen={isContributionModalOpen}
        onClose={() => setIsContributionModalOpen(false)}
        onSuccess={fetchData}
        defaultType="savings"
      />

      <div className="premium-banner-wrapper">
        <div className="glass-card premium-savings-banner">
          <div className="banner-visual">
            <div className="visual-circle">
              <PiggyBank size={32} color="var(--color-accent-primary)" />
            </div>
            <div className="banner-data">
              <span className="banner-label">Consolidated Balance</span>
              <span className="banner-value">R {totalSavings.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="banner-progress-section">
            <div className="progress-header">
              <span className="goal-label">Retirement Goal: R {savingsGoal.toLocaleString()}</span>
              <span className="goal-percent">{progressPercent.toFixed(0)}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}>
                <div className="progress-glow"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="savings-main-grid">
        <div className="accounts-column">
          <div className="section-header">
            <Landmark size={20} className="gradient-text" />
            <h3 style={{ fontWeight: 700 }}>Management</h3>
          </div>
          <div className="accounts-list">
            {accounts.map(account => (
              <div key={account._id} className="glass-card account-card-premium">
                <div className="account-top">
                  <span className="account-type-tag">{account.accountType}</span>
                  <div className="account-icon-mini">
                    <Landmark size={16} color="var(--color-accent-primary)" />
                  </div>
                </div>
                <h4 className="account-title-label">{account.accountName}</h4>
                <div className="account-balance-display">
                  <span className="bal-label">Current Balance</span>
                  <span className="bal-value">R {account.balance.toLocaleString()} {account.currency}</span>
                </div>
                <button className="btn-ghost-sm" style={{ width: '100%', marginTop: 'auto' }}>Details</button>
              </div>
            ))}
            {accounts.length === 0 && (
              <div className="empty-mini">No active accounts.</div>
            )}
          </div>
        </div>

        <div className="history-column">
          <div className="section-header">
            <History size={20} className="gradient-text" />
            <h3 style={{ fontWeight: 700 }}>Recent Activity</h3>
          </div>
          <div className="glass-card activity-container-premium">
            {history.length === 0 ? (
              <div className="empty-state-mini">
                <History size={32} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <p>No contribution history found.</p>
              </div>
            ) : (
              history.map(item => (
                <div key={item._id} className="activity-item-premium">
                  <div className="activity-icon-box">
                    <TrendingUp size={16} />
                  </div>
                  <div className="activity-info">
                    <span className="activity-desc">{item.description}</span>
                    <span className="activity-date">{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <div className="activity-amount-box">
                    <span className="activity-amount">+ R {item.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .view-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .premium-banner-wrapper {
          position: relative;
        }

        .premium-savings-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2.5rem;
          background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.1);
          gap: 3rem;
        }

        @media (max-width: 900px) {
          .premium-savings-banner {
            flex-direction: column;
            align-items: flex-start;
            gap: 2rem;
          }
        }

        .banner-visual {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .visual-circle {
          width: 64px;
          height: 64px;
          background: rgba(79, 163, 224, 0.1);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(79, 163, 224, 0.2);
        }

        .banner-data {
          display: flex;
          flex-direction: column;
        }

        .banner-label {
          font-size: 0.875rem;
          color: var(--color-text-muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .banner-value {
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
        }

        .banner-progress-section {
          flex: 1;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        @media (max-width: 900px) {
          .banner-progress-section {
            max-width: 100%;
            width: 100%;
          }
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .goal-label { color: var(--color-text-muted); }
        .goal-percent { color: var(--color-accent-primary); }

        .progress-track {
          height: 10px;
          background: rgba(255,255,255,0.05);
          border-radius: 5px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-accent-primary), var(--color-accent-secondary));
          border-radius: 5px;
          position: relative;
          transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .progress-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: barShine 3s infinite;
        }

        @keyframes barShine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .savings-main-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 2.5rem;
        }

        @media (max-width: 1024px) {
          .savings-main-grid { grid-template-columns: 1fr; }
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .accounts-list {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }

        .account-card-premium {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: all 0.2s;
        }

        .account-card-premium:hover {
          border-color: var(--color-accent-primary);
          transform: translateX(5px);
        }

        .account-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .account-type-tag {
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--color-accent-primary);
          background: rgba(79, 163, 224, 0.1);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .account-title-label {
          font-size: 1.1rem;
          font-weight: 700;
          color: white;
        }

        .account-balance-display {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .bal-label {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          font-weight: 600;
        }

        .bal-value {
          font-size: 1.25rem;
          font-weight: 800;
          color: white;
        }

        .activity-container-premium {
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
        }

        .activity-item-premium {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: background 0.2s;
        }

        .activity-item-premium:last-child { border-bottom: none; }

        .activity-item-premium:hover {
          background: rgba(255,255,255,0.02);
        }

        .activity-icon-box {
          width: 40px;
          height: 40px;
          background: rgba(104, 211, 145, 0.1);
          color: var(--color-income);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .activity-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .activity-desc {
          font-weight: 700;
          color: white;
        }

        .activity-date {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }

        .activity-amount-box {
          text-align: right;
        }

        .activity-amount {
          font-weight: 800;
          color: var(--color-income);
          font-size: 1.1rem;
        }

        .empty-state-mini {
          padding: 4rem 2rem;
          text-align: center;
          color: var(--color-text-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      `}</style>
    </div>
  );
}
