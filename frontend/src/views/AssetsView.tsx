'use client';

import React, { useState, useEffect } from 'react';
import { graphqlFetch } from '@/lib/graphql';
import { Landmark, TrendingUp, Plus } from 'lucide-react';
import AddAssetModal from '@/components/dashboard/AddAssetModal';

interface Asset {
  _id: string;
  name: string;
  category: string;
  purchasePrice: number;
  currentValue: number;
  purchaseDate: string;
}

export default function AssetsView() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAssets = React.useCallback(async () => {
    setLoading(true);
    try {
      const query = `
        query MyAssets {
          myAssets {
            _id
            name
            category
            purchasePrice
            currentValue
            purchaseDate
          }
        }
      `;
      const result = await graphqlFetch<{ myAssets: Asset[] }>({
        query,
      });
      if (result.data) {
        setAssets(result.data.myAssets);
      }
      setLoading(false); // Set loading to false on success
    } catch (err) {
      console.error('Failed to fetch assets:', err);
      setLoading(false); // Set loading to false on error
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const totalValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalGrowth = assets.reduce((sum, asset) => sum + (asset.currentValue - asset.purchasePrice), 0);

  return (
    <div className="view-container">
      <header className="view-header">
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Farm Assets</h2>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Add New Asset
        </button>
      </header>

      <AddAssetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchAssets}
      />

      <div className="summary-grid">
        <div className="glass-card summary-card">
          <span className="summary-label">Total Asset Value</span>
          <span className="summary-value">R {totalValue.toLocaleString()}</span>
        </div>
        <div className="glass-card summary-card">
          <span className="summary-label">Overall Growth</span>
          <span className="summary-value" style={{ color: totalGrowth >= 0 ? 'var(--color-income)' : 'var(--color-expense)' }}>
            {totalGrowth >= 0 ? '+' : ''} R {totalGrowth.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="assets-grid">
        {loading ? (
          <div className="loading-state">Loading assets...</div>
        ) : (
          assets.map((asset) => (
            <div key={asset._id} className="glass-card asset-item">
              <div className="asset-header">
                <div className="asset-icon">
                  <Landmark size={24} color="var(--color-accent-primary)" />
                </div>
                <div className="asset-title">
                  <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{asset.name}</h4>
                  <span className="asset-category">{asset.category}</span>
                </div>
              </div>
              
              <div className="asset-details">
                <div className="detail-row">
                  <span className="detail-label">Current Value</span>
                  <span className="detail-value highlight">R {asset.currentValue.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Purchase Price</span>
                  <span className="detail-value">R {asset.purchasePrice.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Purchased On</span>
                  <span className="detail-value">{new Date(asset.purchaseDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="asset-footer">
                <div className="growth-indicator">
                  <TrendingUp size={16} color={asset.currentValue >= asset.purchasePrice ? 'var(--color-income)' : 'var(--color-expense)'} />
                  <span style={{ color: asset.currentValue >= asset.purchasePrice ? 'var(--color-income)' : 'var(--color-expense)', fontWeight: 600 }}>
                    {((asset.currentValue - asset.purchasePrice) / asset.purchasePrice * 100).toFixed(1)}%
                  </span>
                </div>
                <button className="btn-ghost-sm">Manage</button>
              </div>
            </div>
          ))
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
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }
        .summary-card {
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .summary-label {
          font-size: 0.875rem;
          color: var(--color-text-muted);
          font-weight: 500;
        }
        .summary-value {
          font-size: 1.5rem;
          font-weight: 700;
        }
        .assets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .asset-item {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          transition: transform 0.2s;
        }
        .asset-item:hover {
          transform: translateY(-4px);
          border-color: var(--color-accent-primary);
        }
        .asset-header {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .asset-icon {
          width: 48px;
          height: 48px;
          background: rgba(79, 163, 224, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .asset-category {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 700;
        }
        .asset-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 1rem 0;
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .detail-label {
          font-size: 0.875rem;
          color: var(--color-text-muted);
        }
        .detail-value {
          font-size: 0.95rem;
          font-weight: 600;
        }
        .detail-value.highlight {
          color: white;
          font-size: 1.1rem;
          font-weight: 700;
        }
        .asset-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .growth-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .loading-state {
          grid-column: 1 / -1;
          padding: 4rem;
          text-align: center;
          color: var(--color-text-muted);
        }
      `}</style>
    </div>
  );
}
