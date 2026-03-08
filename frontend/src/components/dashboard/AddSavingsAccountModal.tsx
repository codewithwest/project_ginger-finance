'use client';

import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { graphqlFetch } from '@/lib/graphql';

interface AddSavingsAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

const ACCOUNT_TYPES = [
  { id: 'bank', label: 'Bank Account' },
  { id: 'investment', label: 'Investment' },
  { id: 'emergency', label: 'Emergency Fund' },
  { id: 'cash', label: 'Cash' },
];

export default function AddSavingsAccountModal({ isOpen, onClose, onSuccess }: Omit<AddSavingsAccountModalProps, 'userId'>) {
  const [formData, setFormData] = useState({
    accountName: '',
    accountType: 'bank',
    balance: '',
    currency: 'ZAR',
  });
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const mutation = `
      mutation CreateSavingsAccount($input: CreateSavingsAccountInput!) {
        createSavingsAccount(input: $input) {
          _id
          accountName
        }
      }
    `;

    try {
      const result = await graphqlFetch({
        query: mutation,
        variables: {
          input: {
            accountName: formData.accountName,
            accountType: formData.accountType,
            balance: parseFloat(formData.balance || '0'),
            currency: formData.currency,
          },
        },
      });

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add savings account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card modal-content" style={{ maxWidth: '450px', width: '90%', padding: '2rem' }}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>New Savings Account</h2>
          <button onClick={onClose} className="btn-ghost-sm"><X size={20} /></button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Account Name</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. Farm Savings"
              value={formData.accountName}
              onChange={(event) => setFormData({ ...formData, accountName: event.target.value })}
            />
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Account Type</label>
            <div 
              className="custom-select-trigger" 
              onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
            >
              <span>{ACCOUNT_TYPES.find(type => type.id === formData.accountType)?.label}</span>
              <ChevronDown size={18} />
            </div>
            {isTypeDropdownOpen && (
              <div className="custom-dropdown-menu">
                {ACCOUNT_TYPES.map(type => (
                  <div 
                    key={type.id} 
                    className="dropdown-item"
                    onClick={() => {
                      setFormData({...formData, accountType: type.id});
                      setIsTypeDropdownOpen(false);
                    }}
                  >
                    {type.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Initial Balance (R)</label>
            <input
              type="number"
              className="form-input"
              placeholder="0.00"
              value={formData.balance}
              onChange={(event) => setFormData({ ...formData, balance: event.target.value })}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? 'Adding...' : 'Create Account'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-label {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          font-weight: 500;
        }
        .error-banner {
          margin-bottom: 1.5rem;
          padding: 0.75rem;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 8px;
          font-size: 0.875rem;
        }
        .custom-select-trigger {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }
        .custom-dropdown-menu {
          position: absolute;
          top: calc(100% + 5px);
          left: 0; right: 0;
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          z-index: 10;
          padding: 0.5rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        }
        .dropdown-item {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--color-accent-primary);
        }
      `}</style>
    </div>
  );
}
