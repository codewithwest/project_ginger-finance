'use client';

import React, { useState, useEffect } from 'react';
import { graphqlFetch } from '@/lib/graphql';
import { ArrowDownRight, ArrowUpRight, Filter, SortDesc, Search, ChevronDown } from 'lucide-react';

interface Transaction {
  _id: string;
  type: 'income' | 'expense' | 'savings';
  amount: number;
  date: string;
  description: string;
  tags: string[];
}

export default function TransactionsView({ userId }: { userId: string }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('date_desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const fetchTransactions = React.useCallback(async () => {
    setLoading(true);
    try {
      const query = `
        query MyTransactions($userId: ID!, $type: String, $sort: String) {
          myTransactions(userId: $userId, type: $type, sort: $sort) {
            _id
            description
            amount
            type
            date
            tags
          }
        }
      `;
      const result = await graphqlFetch<{ myTransactions: Transaction[] }>({
        query,
        variables: { userId, type: filterType || undefined, sort: sortOrder },
      });
      if (result.data) {
        setTransactions(result.data.myTransactions);
      }
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, filterType, sortOrder]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredTransactions = transactions.filter(transaction => 
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="view-container">
      <header className="view-header">
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Transaction History</h2>
        <div className="view-actions">
          <div className="search-bar">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="filters-row">
        <div className="filter-group" style={{ position: 'relative' }}>
          <Filter size={18} />
          <div 
            className="custom-filter-trigger" 
            onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
          >
            <span>{filterType ? filterType.charAt(0).toUpperCase() + filterType.slice(1) : 'All Types'}</span>
            <ChevronDown size={14} />
          </div>
          {isTypeDropdownOpen && (
            <div className="custom-dropdown-menu filter-menu">
              <div className="dropdown-item" onClick={() => { setFilterType(''); setIsTypeDropdownOpen(false); }}>All Types</div>
              <div className="dropdown-item" onClick={() => { setFilterType('income'); setIsTypeDropdownOpen(false); }}>Income</div>
              <div className="dropdown-item" onClick={() => { setFilterType('expense'); setIsTypeDropdownOpen(false); }}>Expense</div>
              <div className="dropdown-item" onClick={() => { setFilterType('savings'); setIsTypeDropdownOpen(false); }}>Savings</div>
            </div>
          )}
        </div>

        <div className="filter-group" style={{ position: 'relative' }}>
          <SortDesc size={18} />
          <div 
            className="custom-filter-trigger" 
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
          >
            <span>{sortOrder === 'date_desc' ? 'Newest First' : 'Oldest First'}</span>
            <ChevronDown size={14} />
          </div>
          {isSortDropdownOpen && (
            <div className="custom-dropdown-menu filter-menu">
              <div className="dropdown-item" onClick={() => { setSortOrder('date_desc'); setIsSortDropdownOpen(false); }}>Newest First</div>
              <div className="dropdown-item" onClick={() => { setSortOrder('date_asc'); setIsSortDropdownOpen(false); }}>Oldest First</div>
            </div>
          )}
        </div>
      </div>

      <div className="glass-card table-container">
        {loading ? (
          <div className="loading-state">Loading transactions...</div>
        ) : (
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Type</th>
                <th>Category</th>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>
                    <div className="desc-cell">
                      <span className="desc-text">{transaction.description}</span>
                      <div className="tags-list">
                        {transaction.tags.map(tag => (
                          <span key={tag} className="tag-pill">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`type-badge ${transaction.type}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td>
                    {/* Category info not in immediate schema yet, but coming from seed */}
                    <span style={{ color: 'var(--color-text-muted)' }}>Farm</span>
                  </td>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className={`amount-cell ${transaction.type}`}>
                    {transaction.type === 'income' ? '+' : '-'} R {transaction.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                    No transactions found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <style jsx>{`
        .view-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 1rem;
        }
        .view-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .search-bar {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 0.6rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 300px;
        }
        .search-bar input {
          background: transparent;
          border: none;
          color: white;
          outline: none;
          width: 100%;
        }
        .filters-row {
          display: flex;
          gap: 1rem;
        }
        .filter-group {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 0.5rem 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-text-secondary);
        }
        .custom-filter-trigger {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 0.5rem 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          color: white;
          transition: all 0.2s;
        }
        .custom-filter-trigger:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.2);
        }
        .custom-dropdown-menu {
          position: absolute;
          top: calc(100% + 5px);
          left: 0;
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 0.5rem;
          z-index: 100;
          box-shadow: 0 10px 25px rgba(0,0,0,0.5);
          animation: slideDown 0.2s ease-out;
        }
        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .filter-menu {
          min-width: 140px;
          top: calc(100% + 8px);
        }
        .filter-group select {
          display: none;
        }
        .dropdown-item {
          padding: 0.6rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: background 0.2s;
        }
        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--color-accent-primary);
        }
        .table-container {
          overflow: hidden;
        }
        .transaction-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .transaction-table th {
          background: rgba(255, 255, 255, 0.02);
          padding: 1rem 1.5rem;
          font-size: 0.8rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--color-border);
        }
        .transaction-table td {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--color-border);
        }
        .desc-cell {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .desc-text {
          font-weight: 600;
          color: white;
        }
        .tags-list {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }
        .tag-pill {
          font-size: 0.7rem;
          background: rgba(79, 163, 224, 0.1);
          color: var(--color-accent-primary);
          padding: 0.1rem 0.5rem;
          border-radius: 4px;
        }
        .type-badge {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
        }
        .type-badge.income { background: rgba(104, 211, 145, 0.15); color: var(--color-income); }
        .type-badge.expense { background: rgba(239, 68, 68, 0.15); color: var(--color-expense); }
        .type-badge.savings { background: rgba(79, 163, 224, 0.15); color: var(--color-accent-primary); }
        .amount-cell {
          font-weight: 700;
          text-align: right;
        }
        .amount-cell.income { color: var(--color-income); }
        .amount-cell.expense { color: var(--color-expense); }
        .amount-cell.savings { color: var(--color-accent-primary); }
        .loading-state {
          padding: 4rem;
          text-align: center;
          color: var(--color-text-muted);
        }
      `}</style>
    </div>
  );
}
