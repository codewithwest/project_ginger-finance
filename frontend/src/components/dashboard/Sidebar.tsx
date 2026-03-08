'use client';

import React from 'react';
import { LayoutDashboard, Receipt, Landmark, PiggyBank, LogOut, Leaf, Users } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'transactions', label: 'Transactions', icon: <Receipt size={20} /> },
    { id: 'assets', label: 'Assets', icon: <Landmark size={20} /> },
    { id: 'savings', label: 'Savings', icon: <PiggyBank size={20} /> },
    { id: 'household', label: 'Household', icon: <Users size={20} /> },
  ];

  return (
    <div className="sidebar-container">
      <div className="sidebar-logo">
        <div className="logo-box-sm">
          <Leaf size={18} color="white" />
        </div>
        <span className="logo-text-sm gradient-text">Ginger</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item logout" onClick={onLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

    </div>
  );
}
