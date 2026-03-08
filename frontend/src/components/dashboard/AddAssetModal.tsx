'use client';

import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { graphqlFetch } from '@/lib/graphql';

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

const CATEGORIES = ['Land', 'Vehicle', 'Livestock', 'Equipment', 'Other'];

export default function AddAssetModal({ isOpen, onClose, onSuccess }: Omit<AddAssetModalProps, 'userId'>) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Land',
    purchasePrice: '',
    currentValue: '',
    purchaseDate: new Date().toISOString().split('T')[0],
  });
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const mutation = `
      mutation CreateAsset($input: CreateAssetInput!) {
        createAsset(input: $input) {
          _id
          name
        }
      }
    `;

    try {
      const result = await graphqlFetch({
        query: mutation,
        variables: {
          input: {
            name: formData.name,
            category: formData.category,
            purchasePrice: parseFloat(formData.purchasePrice),
            currentValue: parseFloat(formData.currentValue),
            purchaseDate: new Date(formData.purchaseDate).toISOString(),
          },
        },
      });

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add asset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card modal-content" style={{ maxWidth: '500px', width: '90%', padding: '2rem' }}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Add New Asset</h2>
          <button onClick={onClose} className="btn-ghost-sm"><X size={20} /></button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Asset Name</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. John Deere Tractor"
              value={formData.name}
              onChange={(event) => setFormData({ ...formData, name: event.target.value })}
            />
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Category</label>
            <div 
              className="custom-select-trigger" 
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            >
              <span>{formData.category}</span>
              <ChevronDown size={18} />
            </div>
            {isCategoryDropdownOpen && (
              <div className="custom-dropdown-menu">
                {CATEGORIES.map(cat => (
                  <div 
                    key={cat} 
                    className="dropdown-item"
                    onClick={() => {
                      setFormData({...formData, category: cat});
                      setIsCategoryDropdownOpen(false);
                    }}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Purchase Price (R)</label>
              <input
                type="number"
                className="form-input"
                required
                value={formData.purchasePrice}
                onChange={(event) => setFormData({ ...formData, purchasePrice: event.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Current Value (R)</label>
              <input
                type="number"
                className="form-input"
                required
                value={formData.currentValue}
                onChange={(event) => setFormData({ ...formData, currentValue: event.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Purchase Date</label>
            <input
              type="date"
              className="form-input"
              required
              value={formData.purchaseDate}
              onChange={(event) => setFormData({ ...formData, purchaseDate: event.target.value })}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? 'Adding...' : 'Add Asset'}
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
