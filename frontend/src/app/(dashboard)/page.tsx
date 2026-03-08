'use client';

import { TrendingUp, TrendingDown, PiggyBank, Wallet, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const mockStats = {
  totalIncome: 12500,
  totalExpenses: 4830,
  totalSavings: 2000,
  currentBalance: 5670,
  totalAssetsValue: 78500,
};

const mockRecentTransactions = [
  { id: '1', type: 'Income', category: 'Farm Sales', amount: 5000, date: '2026-03-07', store: 'Local Market' },
  { id: '2', type: 'Expense', category: 'Feed', amount: 430, date: '2026-03-06', store: 'Tractor Supply' },
  { id: '3', type: 'Savings', category: 'Emergency Fund', amount: 1000, date: '2026-03-05', store: '' },
  { id: '4', type: 'Expense', category: 'Fuel', amount: 220, date: '2026-03-04', store: 'Shell' },
  { id: '5', type: 'Income', category: 'Salary', amount: 3500, date: '2026-03-01', store: '' },
];

function StatCard({
  label,
  amount,
  icon: Icon,
  color,
  trend,
}: {
  label: string;
  amount: number;
  icon: any;
  color: string;
  trend?: string;
}) {

  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>{label}</span>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: color, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon size={18} color="white" />
        </div>
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
        R {amount.toLocaleString()}
      </div>
      {trend && (
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{trend}</span>
      )}
    </div>
  );
}

function TransactionBadge({ type }: { type: string }) {
  const classMap: Record<string, string> = {
    Income: 'badge-income',
    Expense: 'badge-expense',
    Savings: 'badge-savings',
  };

  return (
    <span className={classMap[type] || ''} style={{
      padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 500
    }}>
      {type}
    </span>
  );
}

export default function DashboardPage() {
  const balanceColor = mockStats.currentBalance >= 0 ? 'var(--color-income)' : 'var(--color-expense)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '0.3rem' }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Your financial overview — {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Balance Hero */}
      <div className="glass-card" style={{
        padding: '2rem',
        background: 'linear-gradient(135deg, rgba(79,163,224,0.12), rgba(56,178,172,0.08))',
        borderColor: 'rgba(79,163,224,0.2)',
      }}>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
          Current Balance
        </p>
        <div style={{ fontSize: '3rem', fontWeight: 800, color: balanceColor, letterSpacing: '-0.04em' }}>
          R {mockStats.currentBalance.toLocaleString()}
        </div>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem', fontSize: '0.85rem' }}>
          Income R {mockStats.totalIncome.toLocaleString()} &mdash; Expenses R {mockStats.totalExpenses.toLocaleString()} &mdash; Savings R {mockStats.totalSavings.toLocaleString()}
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <StatCard label="Total Income" amount={mockStats.totalIncome} icon={TrendingUp} color="linear-gradient(135deg,#48bb78,#38a169)" trend="This month" />
        <StatCard label="Total Expenses" amount={mockStats.totalExpenses} icon={TrendingDown} color="linear-gradient(135deg,#fc8181,#e53e3e)" trend="This month" />
        <StatCard label="Savings" amount={mockStats.totalSavings} icon={PiggyBank} color="linear-gradient(135deg,#f6ad55,#dd6b20)" trend="This month" />
        <StatCard label="Assets Value" amount={mockStats.totalAssetsValue} icon={Package} color="linear-gradient(135deg,#4fa3e0,#3182ce)" trend="All owned assets" />
      </div>

      {/* Recent Transactions */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontWeight: 600, fontSize: '1.05rem' }}>Recent Transactions</h2>
          <Link href="/transactions" style={{
            display: 'flex', alignItems: 'center', gap: '0.3rem',
            color: 'var(--color-accent-primary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500
          }}>
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {mockRecentTransactions.map((transaction) => (
            <div key={transaction.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '0.875rem 1rem',
              background: 'rgba(255,255,255,0.025)',
              borderRadius: '10px',
              border: '1px solid var(--color-border)',
              transition: 'background 0.2s ease',
            }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <TransactionBadge type={transaction.type} />
                <div>
                  <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{transaction.category}</div>
                  {transaction.store && (
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>{transaction.store}</div>
                  )}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontWeight: 700,
                  color: transaction.type === 'Income' ? 'var(--color-income)' :
                    transaction.type === 'Savings' ? 'var(--color-savings)' : 'var(--color-expense)'
                }}>
                  {transaction.type === 'Income' ? '+' : '-'} R {transaction.amount.toLocaleString()}
                </div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>{transaction.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
