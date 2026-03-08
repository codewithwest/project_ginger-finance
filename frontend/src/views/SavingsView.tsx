'use client';

import React, { useState, useEffect } from 'react';
import { graphqlFetch } from '@/lib/graphql';
import { PiggyBank, ArrowUpRight, History, Landmark } from 'lucide-react';
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
        setHistory(result.data.myTransactions);
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

  if (loading) return (
    <div className="loader-container">
      <div className="loader-3d"></div>
    </div>
  );

  return (
    <div className="view-container">
      <header className="view-header">
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Savings & Investments</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-ghost" onClick={() => setIsAccountModalOpen(true)}>New Account</button>
          <button className="btn-primary" onClick={() => setIsContributionModalOpen(true)}>New Contribution</button>
        </div>
      </header>

      <AddSavingsAccountModal 
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onSuccess={fetchData}
      />

      {/* Pre-configured modal for savings contributions */}
      <AddTransactionModal 
        isOpen={isContributionModalOpen}
        onClose={() => setIsContributionModalOpen(false)}
        onSuccess={fetchData}
        defaultType="savings"
      />

      <div className="summary-banner glass-card">
        <div className="banner-icon">
          <PiggyBank size={32} color="white" />
        </div>
        <div className="banner-info">
          <span className="banner-label">Total Combined Savings</span>
          <span className="banner-value">R {totalSavings.toLocaleString()}</span>
        </div>
        <div className="banner-viz">
           {/* Simple progress bar mock */}
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '200px' }}>
              <div style={{ display: 'flex', justifySelf: 'space-between', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>
                <span>Goal: R 500k</span>
                <span style={{ marginLeft: 'auto' }}>{(totalSavings/500000*100).toFixed(0)}%</span>
              </div>
              <div className="progress-bg">
                <div className="progress-fill" style={{ width: `${Math.min(100, (totalSavings/500000*100))}%` }}></div>
              </div>
           </div>
        </div>
      </div>

      <div className="savings-main-grid">
        <div className="accounts-column">
          <div className="section-header">
            <Landmark size={20} />
            <h3 style={{ fontWeight: 700 }}>Your Accounts</h3>
          </div>
          <div className="accounts-list">
            {accounts.map(account => (
              <div key={account._id} className="glass-card account-card">
                <div className="account-info">
                  <span className="account-tag">{account.accountType}</span>
                  <h4 style={{ fontWeight: 700 }}>{account.accountName}</h4>
                </div>
                <div className="account-balance">
                  <span className="balance-label">Balance</span>
                  <span className="balance-value">R {account.balance.toLocaleString()} {account.currency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="history-column">
          <div className="section-header">
            <History size={20} />
            <h3 style={{ fontWeight: 700 }}>Contribution History</h3>
          </div>
          <div className="glass-card history-container">
            {history.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                No savings history yet.
              </div>
            ) : (
              history.map(item => (
                <div key={item._id} className="history-item">
                  <div className="history-icon">
                    <ArrowUpRight size={18} />
                  </div>
                  <div className="history-details">
                    <span className="history-desc">{item.description}</span>
                    <span className="history-date">{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <span className="history-amount">+ R {item.amount.toLocaleString()}</span>
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
          padding: 1rem;
        }
        .view-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .summary-banner {
          background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary));
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 2.5rem;
          color: white;
          border: none;
        }
        .banner-icon {
          width: 64px;
          height: 64px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .banner-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
        }
        .banner-label {
          font-size: 1rem;
          opacity: 0.8;
          font-weight: 500;
        }
        .banner-value {
          font-size: 2.5rem;
          font-weight: 800;
        }
        .progress-bg {
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: white;
          border-radius: 4px;
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
          color: var(--color-text-primary);
        }
        .accounts-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .account-card {
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: transform 0.2s;
        }
        .account-card:hover { transform: translateX(5px); border-color: var(--color-accent-primary); }
        .account-tag {
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--color-accent-primary);
          background: rgba(79, 163, 224, 0.1);
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          margin-bottom: 0.5rem;
          display: inline-block;
        }
        .account-balance {
          text-align: right;
        }
        .balance-label {
          display: block;
          font-size: 0.8rem;
          color: var(--color-text-muted);
          margin-bottom: 0.25rem;
        }
        .balance-value {
          font-weight: 700;
          font-size: 1.1rem;
        }
        .history-container {
          padding: 1rem;
          max-height: 400px;
          overflow-y: auto;
        }
        .history-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          border-bottom: 1px solid var(--color-border);
        }
        .history-item:last-child { border-bottom: none; }
        .history-icon {
          width: 36px;
          height: 36px;
          background: rgba(104, 211, 145, 0.15);
          color: var(--color-income);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .history-details {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .history-desc { font-weight: 600; font-size: 0.95rem; }
        .history-date { font-size: 0.8rem; color: var(--color-text-muted); }
        .history-amount { font-weight: 700; color: var(--color-income); }
      `}</style>
    </div>
  );
}
