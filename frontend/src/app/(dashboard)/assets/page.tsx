'use client';

import { useState } from 'react';
import { Plus, Search, Package, Tractor, Home, Wrench } from 'lucide-react';

const mockAssets = [
  { id: '1', name: 'Main Barn', type: 'Infrastructure', status: 'Owned', cost: 45000, boughtDate: '2024-01-15', store: 'Local Builder' },
  { id: '2', name: 'John Deere Tractor', type: 'Equipment', status: 'Owned', cost: 28000, boughtDate: '2024-06-20', store: 'Deere Dealer' },
  { id: '3', name: 'Irrigation System', type: 'Equipment', status: 'Pending', cost: 12000, plannedDate: '2026-05-01', store: 'AgriTech Store' },
  { id: '4', name: 'Chicken Coop', type: 'Infrastructure', status: 'Owned', cost: 3500, boughtDate: '2025-03-10', store: '' },
];

const typeIcons: Record<string, any> = {
  Equipment: Tractor,
  Infrastructure: Home,
  default: Wrench,
};

export default function AssetsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Owned' | 'Pending'>('All');

  const filteredAssets = mockAssets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.store.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || asset.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '0.3rem' }}>Assets</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>Track your farm assets — owned and pending.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> Add Asset
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            className="form-input"
            style={{ paddingLeft: '2.25rem' }}
            placeholder="Search by name or store..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['All', 'Owned', 'Pending'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={statusFilter === filter ? 'btn-primary' : 'btn-ghost'}
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Assets Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {filteredAssets.map((asset) => {
          const IconComponent = typeIcons[asset.type] || typeIcons.default;

          return (
            <div key={asset.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: asset.status === 'Owned' ? 'rgba(72,187,120,0.15)' : 'rgba(246,173,85,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <IconComponent size={18} color={asset.status === 'Owned' ? '#68d391' : '#f6ad55'} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{asset.name}</div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>{asset.type}</div>
                  </div>
                </div>
                <span className={`badge-${asset.status.toLowerCase()}`} style={{
                  padding: '0.2rem 0.65rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 500
                }}>
                  {asset.status}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  {asset.store && <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{asset.store}</div>}
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                    {asset.status === 'Owned' ? `Bought: ${asset.boughtDate}` : `Planned: ${asset.plannedDate}`}
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-accent-primary)' }}>
                  R {asset.cost.toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
