'use client';

import React, { useState, useEffect } from 'react';
import { graphqlFetch } from '@/lib/graphql';
import { Filter, SortDesc, Search, ChevronDown, Receipt, ArrowUpRight, ArrowDownRight, Tag } from 'lucide-react';

interface Transaction {
  _id: string;
  type: 'income' | 'expense' | 'savings';
  amount: number;
  date: string;
  description: string;
  tags: string[];
}

interface Category {
  _id: string;
  name: string;
}

export default function TransactionsView() {
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
        query GetTransactionsData($type: String, $sort: String) {
          myTransactions(type: $type, sort: $sort) {
            _id
            description
            amount
            type
            date
            tags
          }
          myCategories {
            _id
            name
          }
        }
      `;
      const result = await graphqlFetch<{ myTransactions: Transaction[], myCategories: Category[] }>({
        query,
        variables: { type: filterType || undefined, sort: sortOrder },
      });
      if (result.data) {
        setTransactions(result.data.myTransactions || []);
      }
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [filterType, sortOrder]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredTransactions = transactions.filter(transaction => 
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading && transactions.length === 0) return (
    <div className="loader-container">
      <div className="loader-3d"></div>
    </div>
  );

  return (
    <div className="view-container">
      <header className="view-header">
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Receipt className="gradient-text" size={32} />
            Transaction History
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Chronological record of all household cash flows.</p>
        </div>
        
        <div className="view-actions">
          <div className="search-bar-premium">
            <Search size={18} color="var(--color-text-muted)" />
            <input 
              type="text" 
              placeholder="Search by description or tag..." 
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="filters-row-premium">
        <div className="dropdown-wrapper">
          <div 
            className={`custom-select-trigger ${filterType ? 'active' : ''}`} 
            onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
          >
            <Filter size={16} />
            <span>{filterType ? filterType.charAt(0).toUpperCase() + filterType.slice(1) : 'All Types'}</span>
            <ChevronDown size={14} className={isTypeDropdownOpen ? 'rotate' : ''} />
          </div>
          {isTypeDropdownOpen && (
            <div className="glass-card custom-dropdown-menu">
              <div className="dropdown-item" onClick={() => { setFilterType(''); setIsTypeDropdownOpen(false); }}>All Types</div>
              <div className="dropdown-item" onClick={() => { setFilterType('income'); setIsTypeDropdownOpen(false); }}>Income</div>
              <div className="dropdown-item" onClick={() => { setFilterType('expense'); setIsTypeDropdownOpen(false); }}>Expense</div>
              <div className="dropdown-item" onClick={() => { setFilterType('savings'); setIsTypeDropdownOpen(false); }}>Savings</div>
            </div>
          )}
        </div>

        <div className="dropdown-wrapper">
          <div 
            className="custom-select-trigger" 
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
          >
            <SortDesc size={16} />
            <span>{sortOrder === 'date_desc' ? 'Newest First' : 'Oldest First'}</span>
            <ChevronDown size={14} className={isSortDropdownOpen ? 'rotate' : ''} />
          </div>
          {isSortDropdownOpen && (
            <div className="glass-card custom-dropdown-menu">
              <div className="dropdown-item" onClick={() => { setSortOrder('date_desc'); setIsSortDropdownOpen(false); }}>Newest First</div>
              <div className="dropdown-item" onClick={() => { setSortOrder('date_asc'); setIsSortDropdownOpen(false); }}>Oldest First</div>
            </div>
          )}
        </div>
      </div>

      <div className="glass-card table-wrapper-premium">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Description & Tags</th>
              <th>Category</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction._id} className="premium-row">
                <td style={{ width: '80px' }}>
                  <div className={`status-icon-box ${transaction.type}`}>
                    {transaction.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                  </div>
                </td>
                <td>
                  <div className="desc-content">
                    <span className="primary-desc">{transaction.description}</span>
                    <div className="tags-container">
                      {transaction.tags.map(tag => (
                        <span key={tag} className="tag-badge">
                          <Tag size={10} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </td>
                <td>
                  <span className="category-text">{transaction.tags[0] || 'Uncategorized'}</span>
                </td>
                <td>
                  <span className="date-text">{new Date(transaction.date).toLocaleDateString()}</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span className={`amount-text ${transaction.type}`}>
                    {transaction.type === 'income' ? '+' : '-'} R {transaction.amount.toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
            {filteredTransactions.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="empty-table-cell">
                  <Receipt size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                  <p>No transactions match your current filters.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .view-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .search-bar-premium {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 0.75rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          width: 350px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .search-bar-premium:focus-within {
          border-color: var(--color-accent-primary);
          box-shadow: 0 0 0 3px rgba(79, 163, 224, 0.1);
        }

        .search-bar-premium input {
          background: transparent;
          border: none;
          color: white;
          outline: none;
          width: 100%;
          font-size: 0.95rem;
        }

        .filters-row-premium {
          display: flex;
          gap: 1.25rem;
        }

        .dropdown-wrapper {
          position: relative;
        }

        .custom-select-trigger {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 0.6rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          transition: all 0.2s;
        }

        .custom-select-trigger:hover {
          background: rgba(255, 255, 255, 0.06);
          color: white;
        }

        .custom-select-trigger.active {
          border-color: var(--color-accent-primary);
          color: var(--color-accent-primary);
        }

        .rotate {
          transform: rotate(180deg);
        }

        .custom-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          min-width: 180px;
          padding: 0.5rem;
          z-index: 50;
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .dropdown-item {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--color-accent-primary);
        }

        .table-wrapper-premium {
          overflow: hidden;
        }

        .premium-table {
          width: 100%;
          border-collapse: collapse;
        }

        .premium-table th {
          text-align: left;
          padding: 1.25rem 1.5rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          background: rgba(255, 255, 255, 0.01);
        }

        .premium-row {
          transition: background 0.2s;
        }

        .premium-row:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .premium-row td {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }

        .status-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .status-icon-box.income { background: rgba(104, 211, 145, 0.1); color: var(--color-income); }
        .status-icon-box.expense { background: rgba(252, 129, 129, 0.1); color: var(--color-expense); }
        .status-icon-box.savings { background: rgba(79, 163, 224, 0.1); color: var(--color-accent-primary); }

        .desc-content {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .primary-desc {
          font-weight: 700;
          color: white;
          font-size: 1rem;
        }

        .tags-container {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .tag-badge {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.65rem;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.05);
          color: var(--color-text-secondary);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .category-text {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--color-text-secondary);
        }

        .date-text {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--color-text-muted);
        }

        .amount-text {
          font-size: 1.1rem;
          font-weight: 800;
        }

        .amount-text.income { color: var(--color-income); }
        .amount-text.expense { color: var(--color-expense); color: #ff6b6b; }
        .amount-text.savings { color: var(--color-accent-primary); }

        .empty-table-cell {
          padding: 6rem 2rem;
          text-align: center;
          color: var(--color-text-muted);
        }

        .empty-table-cell p {
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
