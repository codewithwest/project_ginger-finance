'use client';

import { useState } from 'react';
import { Plus, Search, RefreshCw } from 'lucide-react';

const mockTransactions = [
  { id: '1', type: 'Income', category: 'Farm Sales', amount: 5000, date: '2026-03-07', store: 'Local Market', isRecurring: false },
  { id: '2', type: 'Expense', category: 'Feed', amount: 430, date: '2026-03-06', store: 'Tractor Supply', isRecurring: true },
  { id: '3', type: 'Savings', category: 'Emergency Fund', amount: 1000, date: '2026-03-05', store: '', isRecurring: true },
  { id: '4', type: 'Expense', category: 'Fuel', amount: 220, date: '2026-03-04', store: 'Shell', isRecurring: false },
  { id: '5', type: 'Income', category: 'Salary', amount: 3500, date: '2026-03-01', store: '', isRecurring: true },
  { id: '6', type: 'Expense', category: 'Veterinary', amount: 850, date: '2026-02-27', store: 'Farm Vet Clinic', isRecurring: false },
];

type TransactionType = 'All' | 'Income' | 'Expense' | 'Savings';

const typeColors: Record<string, string> = {
  Income: 'var(--color-income)',
  Expense: 'var(--color-expense)',
  Savings: 'var(--color-savings)',
};

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType>('All');

  const filteredTransactions = mockTransactions.filter((txn) => {
    const matchesSearch =
      txn.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.store.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All' || txn.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const recurringTemplates = mockTransactions.filter((txn) => txn.isRecurring);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '0.3rem' }}>Transactions</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>Log and track your income, expenses, and savings.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> Add Transaction
        </button>
      </div>

      {/* Quick Add Recurring */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
          <RefreshCw size={15} style={{ color: 'var(--color-accent-primary)' }} />
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Quick Add — Recurring</span>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {recurringTemplates.map((txn) => (
            <button key={txn.id} className="btn-ghost" style={{
              padding: '0.4rem 0.85rem', fontSize: '0.8rem',
              borderColor: typeColors[txn.type] + '44',
              color: typeColors[txn.type],
            }}>
              {txn.category} — R {txn.amount.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      {/* Filter + Search */}
      <div className="glass-card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            className="form-input"
            style={{ paddingLeft: '2.25rem' }}
            placeholder="Search by category or store..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['All', 'Income', 'Expense', 'Savings'] as TransactionType[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setTypeFilter(filter)}
              className={typeFilter === filter ? 'btn-primary' : 'btn-ghost'}
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="glass-card" style={{ padding: '0.5rem' }}>
        {filteredTransactions.map((txn, index) => (
          <div key={txn.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '1rem 1.25rem',
            borderBottom: index < filteredTransactions.length - 1 ? '1px solid var(--color-border)' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: typeColors[txn.type],
                flexShrink: 0,
              }} />
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {txn.category}
                  {txn.isRecurring && (
                    <RefreshCw size={11} style={{ color: 'var(--color-text-muted)' }} />
                  )}
                </div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
                  {txn.store ? `${txn.store} · ` : ''}{txn.date}
                </div>
              </div>
            </div>
            <div style={{
              fontWeight: 700, fontSize: '1rem',
              color: typeColors[txn.type],
            }}>
              {txn.type === 'Income' ? '+' : '-'} R {txn.amount.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
