'use client';

import React, { useState, useEffect } from 'react';
import { X, Tag, ChevronDown } from 'lucide-react';
import { graphqlFetch } from '@/lib/graphql';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultType?: 'income' | 'expense' | 'savings';
}

interface Category {
  _id: string;
  name: string;
  color: string;
}

export default function AddTransactionModal({ isOpen, onClose, onSuccess, defaultType = 'expense' }: AddTransactionModalProps) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: defaultType,
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    tags: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          const result = await graphqlFetch<{ myCategories: Category[] }>({
            query: `
              query MyCategories {
                myCategories {
                  _id
                  name
                  color
                }
              }
            `,
          });
          if (result.data) {
            setCategories(result.data.myCategories);
            if (result.data.myCategories.length > 0) {
              setFormData(prev => ({ ...prev, categoryId: result.data.myCategories[0]._id }));
            }
          }
        } catch (err) {
          console.error('Failed to fetch categories:', err);
        }
      };
      fetchCategories();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const mutation = `
      mutation CreateTransaction($input: CreateTransactionInput!) {
        createTransaction(input: $input) {
          _id
          description
          amount
          type
          date
        }
      }
    `;

    try {
      const result = await graphqlFetch({
        query: mutation,
        variables: {
          input: {
            description: formData.description,
            amount: parseFloat(formData.amount),
            type: formData.type,
            date: new Date(formData.date).toISOString(),
            categoryId: formData.categoryId,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
          },
        },
      });

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card modal-content" style={{ maxWidth: '500px', width: '90%', padding: '2rem' }}>
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Add Transaction</h2>
          <button onClick={onClose} className="btn-ghost-sm"><X size={20} /></button>
        </div>

        {error && (
          <div style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.875rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. Fertilizer purchase"
              value={formData.description}
              onChange={(event) => setFormData({ ...formData, description: event.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Amount (R)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                required
                placeholder="0.00"
                value={formData.amount}
                onChange={(event) => setFormData({ ...formData, amount: event.target.value })}
              />
            </div>
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label">Type</label>
              <div 
                className="custom-select-trigger" 
                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
              >
                <span style={{ textTransform: 'capitalize' }}>{formData.type}</span>
                <ChevronDown size={18} />
              </div>
              {isTypeDropdownOpen && (
                <div className="custom-dropdown-menu">
                  <div className="dropdown-item" onClick={() => { setFormData({...formData, type: 'expense'}); setIsTypeDropdownOpen(false); }}>Expense</div>
                  <div className="dropdown-item" onClick={() => { setFormData({...formData, type: 'income'}); setIsTypeDropdownOpen(false); }}>Income</div>
                </div>
              )}
            </div>
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Category</label>
            <div 
              className="custom-select-trigger" 
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Tag size={18} />
                <span>{categories.find(cat => cat._id === formData.categoryId)?.name || 'Select a category'}</span>
              </div>
              <ChevronDown size={18} />
            </div>
            {isCategoryDropdownOpen && (
              <div className="custom-dropdown-menu">
                {categories.map(category => (
                  <div 
                    key={category._id} 
                    className="dropdown-item"
                    onClick={() => {
                      setFormData({...formData, categoryId: category._id});
                      setIsCategoryDropdownOpen(false);
                    }}
                  >
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: category.color }}></div>
                    {category.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-input"
              required
              value={formData.date}
              onChange={(event) => setFormData({ ...formData, date: event.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tags (comma separated)</label>
            <input
              type="text"
              className="form-input"
              placeholder="farm, supplies, etc."
              value={formData.tags}
              onChange={(event) => setFormData({ ...formData, tags: event.target.value })}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem', width: '100%' }}>
            {loading ? 'Adding...' : 'Add Transaction'}
          </button>
        </form>
      </div>
      
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease-out;
        }
        .modal-content {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text-secondary);
        }
        .custom-select-trigger {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          color: white;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.2s;
        }
        .custom-select-trigger:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.2);
        }
        .custom-dropdown-menu {
          position: absolute;
          top: calc(100% + 5px);
          left: 0;
          right: 0;
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 0.5rem;
          z-index: 100;
          box-shadow: 0 10px 25px rgba(0,0,0,0.5);
          animation: slideDown 0.2s ease-out;
        }
        .dropdown-item {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: background 0.2s;
        }
        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--color-accent-primary);
        }
        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
