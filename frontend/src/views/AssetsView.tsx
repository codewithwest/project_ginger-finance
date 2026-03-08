'use client';

import React, { useState, useEffect } from 'react';
import { graphqlFetch } from '@/lib/graphql';
import { Landmark, TrendingUp, Plus, Briefcase, Activity } from 'lucide-react';
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
    } catch (err) {
      console.error('Failed to fetch assets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const totalValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalGrowth = assets.reduce((sum, asset) => sum + (asset.currentValue - asset.purchasePrice), 0);

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
            <Landmark className="gradient-text" size={32} />
            Farm Assets
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Inventory and valuation of your agricultural holdings.</p>
        </div>
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

      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(79, 163, 224, 0.15)' }}>
            <Briefcase size={24} color="#4fa3e0" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Portfolio Value</span>
            <span className="stat-value">R {totalValue.toLocaleString()}</span>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: totalGrowth >= 0 ? 'rgba(72, 187, 120, 0.15)' : 'rgba(252, 129, 129, 0.15)' }}>
            <Activity size={24} color={totalGrowth >= 0 ? '#48bb78' : '#fc8181'} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Net Unrealized Growth</span>
            <span className="stat-value" style={{ color: totalGrowth >= 0 ? 'var(--color-income)' : 'var(--color-expense)' }}>
              {totalGrowth >= 0 ? '+' : ''} R {totalGrowth.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="assets-grid">
        {assets.map((asset) => (
          <div key={asset._id} className="glass-card asset-card-premium">
            <div className="card-top">
              <div className="category-pill">{asset.category}</div>
              <div className="growth-badge" style={{ color: asset.currentValue >= asset.purchasePrice ? 'var(--color-income)' : 'var(--color-expense)' }}>
                <TrendingUp size={14} />
                {((asset.currentValue - asset.purchasePrice) / (asset.purchasePrice || 1) * 100).toFixed(1)}%
              </div>
            </div>
            
            <h3 className="asset-name-label">{asset.name}</h3>
            
            <div className="value-display">
              <span className="value-label">Current Value</span>
              <span className="value-amount">R {asset.currentValue.toLocaleString()}</span>
            </div>

            <div className="meta-footer">
              <div className="meta-item">
                <span className="meta-label">Basis</span>
                <span className="meta-val">R {asset.purchasePrice.toLocaleString()}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Acquired</span>
                <span className="meta-val">{new Date(asset.purchaseDate).toLocaleDateString()}</span>
              </div>
            </div>

            <button className="btn-ghost-sm" style={{ width: '100%', marginTop: 'auto' }}>View Ledger</button>
          </div>
        ))}
        {assets.length === 0 && (
          <div className="empty-state">
            < Landmark size={48} color="var(--color-text-muted)" style={{ opacity: 0.3 }} />
            <p>No agricultural assets recorded in this household.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .view-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .assets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .asset-card-premium {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.2s;
          height: 100%;
          position: relative;
          overflow: hidden;
        }

        .asset-card-premium:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: var(--color-accent-primary);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .category-pill {
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          background: rgba(255,255,255,0.05);
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          color: var(--color-text-secondary);
          letter-spacing: 0.05em;
        }

        .growth-badge {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .asset-name-label {
          font-size: 1.25rem;
          font-weight: 700;
          color: white;
        }

        .value-display {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .value-label {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          font-weight: 600;
        }

        .value-amount {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--color-accent-primary);
        }

        .meta-footer {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .meta-item {
          display: flex;
          flex-direction: column;
        }

        .meta-label {
          font-size: 0.65rem;
          color: var(--color-text-muted);
          font-weight: 500;
        }

        .meta-val {
          font-size: 0.8rem;
          font-weight: 600;
          color: white;
        }

        .empty-state {
          grid-column: 1 / -1;
          padding: 5rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          color: var(--color-text-muted);
        }
      `}</style>
    </div>
  );
}
