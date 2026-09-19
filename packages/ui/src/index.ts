import React from 'react';

export function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'error' }) {
  const colors = {
    default: { bg: '#f3f4f6', color: '#374151' },
    success: { bg: '#ecfdf5', color: '#065f46' },
    warning: { bg: '#fffbeb', color: '#92400e' },
    error: { bg: '#fef2f2', color: '#991b1b' },
  };
  const style = colors[variant];
  return <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 9999, fontSize: 12, fontWeight: 600, background: style.bg, color: style.color }}>{children}</span>;
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className} style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', padding: 20 }}>{children}</div>;
}

export function Button({ children, variant = 'primary', disabled, onClick, type = 'button' }: { children: React.ReactNode; variant?: 'primary' | 'secondary'; disabled?: boolean; onClick?: () => void; type?: 'button' | 'submit' }) {
  const styles = {
    primary: { background: '#087b58', color: '#fff' },
    secondary: { background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db' },
  };
  return <button type={type} disabled={disabled} onClick={onClick} style={{ ...styles[variant], display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1, border: 'none' }}>{children}</button>;
}
