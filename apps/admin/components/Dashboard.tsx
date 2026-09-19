'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, BriefcaseBusiness, ChevronDown, ChevronUp,
  CircleDollarSign, ClipboardList, Check, FileCheck2, FileText, FileText as FileIcon, Landmark, LayoutDashboard, LogOut, MapPinned,
  Menu, Moon, MoreHorizontal, Search, Settings, ShieldCheck, Sun, UsersRound, UserRound, X, XCircle,
} from 'lucide-react';

type AppDoc = { id: string; name: string; mimeType: string; size: number; createdAt: string };
type AppRow = { id: string; trackingNo: string; serviceName: string; applicant: Record<string, string>; status: string; remarks?: string; documentCount: number; createdAt: string };

type MenuItem = { key: string; label: string; icon: React.ComponentType<{ size?: number }>; badge?: string; children?: { key: string; label: string }[] };

const menuItems: MenuItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'citizen-create', label: 'Citizen Creation', icon: UserRound, children: [{ key: 'citizen-list', label: 'Citizen List' }, { key: 'citizen-verify', label: 'Citizen Verification' }] },
  { key: 'general-citizen', label: 'General Citizen Creation', icon: UsersRound, children: [{ key: 'non-holding-create', label: 'Non-Holding Citizen' }] },
  { key: 'applications', label: 'Service Applications', icon: ClipboardList, children: [{ key: 'certificate-applications', label: 'Certificate Applications' }, { key: 'application-review', label: 'Application Review' }] },
  { key: 'trade-license', label: 'Trade License', icon: BriefcaseBusiness },
  { key: 'tax-assessment', label: 'Tax Assessment', icon: FileCheck2, children: [{ key: 'holding-assessment', label: 'Holding Tax Assessment' }, { key: 'non-holding-assessment', label: 'Non-Holding Tax Assessment' }] },
  { key: 'tax-payment', label: 'Tax Payment', icon: CircleDollarSign, children: [{ key: 'holding-payment', label: 'Holding Tax Payment' }, { key: 'non-holding-payment', label: 'Non-Holding Tax Payment' }] },
  { key: 'election-area', label: 'Election Area', icon: MapPinned, children: [{ key: 'voter-area', label: 'Voter Area List' }] },
  { key: 'profile-create', label: 'Profile Creation', icon: UserRound, children: [{ key: 'profile-list', label: 'Profile List' }] },
  { key: 'area', label: 'Area', icon: Landmark, children: [{ key: 'geo-structure', label: 'Geographic Structure' }] },
  { key: 'service-reports', label: 'Service Reports', icon: FileText, children: [{ key: 'application-report', label: 'Application Report' }] },
  { key: 'holding-report', label: 'Holding Tax Report', icon: FileCheck2, children: [{ key: 'holding-defaulters', label: 'Arrears List' }] },
  { key: 'non-holding-report', label: 'Non-Holding Tax Report', icon: FileCheck2 },
  { key: 'license-report', label: 'Trade License Report', icon: BriefcaseBusiness },
  { key: 'users', label: 'Users & Roles', icon: UsersRound, children: [{ key: 'users-list', label: 'User List' }, { key: 'roles', label: 'Roles & Permissions' }] },
];

const adminBase = typeof window !== 'undefined' ? `${window.location.origin}/admin` : '';

export default function Dashboard() {
  const [dark, setDark] = useState(false);
  const [side, setSide] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [expanded, setExpanded] = useState<string[]>(['tax-payment', 'applications']);
  const [userMenu, setUserMenu] = useState(false);
  const [applications, setApplications] = useState<AppRow[]>([]);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [detailApp, setDetailApp] = useState<(AppRow & { documents: AppDoc[] }) | null>(null);
  const [detailDocs, setDetailDocs] = useState<AppDoc[]>([]);
  const currentLabel = menuItems.flatMap((item) => [item, ...(item.children ?? []).map((child) => ({ ...item, ...child, icon: item.icon }))]).find((item) => item.key === activeMenu)?.label ?? 'Dashboard';

  const authHeaders = useCallback((): Record<string, string> => {
    const token = localStorage.getItem('accessToken');
    const h: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchApplications = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/admin/applications', { headers: authHeaders() });
      if (res.status === 401) { window.location.href = `${adminBase}/login`; return; }
      const data = await res.json();
      if (Array.isArray(data)) setApplications(data);
    } catch { /* keep empty */ }
  }, [authHeaders]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    const urlUser = params.get('user');
    if (urlToken) {
      localStorage.setItem('accessToken', urlToken);
      if (urlUser) localStorage.setItem('user', urlUser);
      window.history.replaceState({}, '', window.location.pathname);
    }
    const token = localStorage.getItem('accessToken');
    if (!token) { window.location.href = `${adminBase}/login`; return; }
    fetchApplications();
  }, [fetchApplications]);

  const handleApprove = async (trackingNo: string) => {
    try {
      const res = await fetch(`/api/v1/admin/applications/${trackingNo}/approve`, { method: 'PATCH', headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      setApplications((prev) => prev.map((a) => a.trackingNo === trackingNo ? { ...a, status: 'ISSUED' } : a));
      showToast(`Application ${trackingNo} approved & certificate issued`);
    } catch (err) { showToast(err instanceof Error ? err.message : 'Approve failed', 'error'); }
  };

  const handleReject = async (trackingNo: string) => {
    try {
      const res = await fetch(`/api/v1/admin/applications/${trackingNo}/reject`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ remarks: 'Rejected by admin' }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      setApplications((prev) => prev.map((a) => a.trackingNo === trackingNo ? { ...a, status: 'REJECTED' } : a));
      showToast(`Application ${trackingNo} rejected`);
    } catch (err) { showToast(err instanceof Error ? err.message : 'Reject failed', 'error'); }
  };

  const openDetail = async (app: AppRow) => {
    setDetailApp({ ...app, documents: [] });
    try {
      const res = await fetch(`/api/v1/admin/applications/${app.trackingNo}`, { headers: authHeaders() });
      const data = await res.json();
      if (data.documents) { setDetailDocs(data.documents); setDetailApp((prev) => prev ? { ...prev, documents: data.documents } : null); }
    } catch { setDetailDocs([]); }
  };

  const selectMenu = (key: string, label: string) => { setActiveMenu(key); setSide(false); if (key !== 'dashboard') setUserMenu(false); };
  const toggle = (key: string) => setExpanded((items) => items.includes(key) ? items.filter((item) => item !== key) : [...items, key]);
  const logout = () => { localStorage.removeItem('accessToken'); localStorage.removeItem('user'); window.location.href = `${adminBase}/login`; };

  return <div className={`admin-shell ${dark ? 'admin-dark' : ''}`}>
    {toast && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#fff', background: toast.type === 'success' ? '#087b58' : '#dc2626', boxShadow: '0 4px 14px rgba(0,0,0,.2)' }}>{toast.msg}</div>}

    {detailApp && <div style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => { setDetailApp(null); setDetailDocs([]); }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, maxWidth: 520, width: '90%', maxHeight: '80vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}><h3 style={{ margin: 0, fontSize: 16 }}>Application Details</h3><button onClick={() => { setDetailApp(null); setDetailDocs([]); }} style={{ background: 'none', border: 0, cursor: 'pointer' }}><X size={18} /></button></div>
        <div style={{ display: 'grid', gap: 8, fontSize: 13 }}>
          <div><strong>Tracking:</strong> {detailApp.trackingNo}</div>
          <div><strong>Service:</strong> {detailApp.serviceName}</div>
          <div><strong>Name:</strong> {detailApp.applicant?.fullName}</div>
          <div><strong>NID:</strong> {detailApp.applicant?.nid}</div>
          <div><strong>Mobile:</strong> {detailApp.applicant?.mobile}</div>
          <div><strong>Father:</strong> {detailApp.applicant?.fatherName}</div>
          <div><strong>Mother:</strong> {detailApp.applicant?.motherName}</div>
          <div><strong>Address:</strong> {detailApp.applicant?.address}</div>
          <div><strong>Ward:</strong> {detailApp.applicant?.ward}</div>
          <div><strong>Status:</strong> <span style={{ color: detailApp.status === 'ISSUED' || detailApp.status === 'APPROVED' ? '#087b58' : detailApp.status === 'REJECTED' ? '#dc2626' : '#b45309', fontWeight: 700 }}>{detailApp.status}</span></div>
        </div>
        <div style={{ marginTop: 16 }}><strong style={{ fontSize: 13 }}>Documents ({detailDocs.length})</strong>
          {detailDocs.length === 0 ? <p style={{ fontSize: 12, color: '#9ca3af', margin: '6px 0 0' }}>No documents uploaded</p> :
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>{detailDocs.map((d) => <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }}><FileIcon size={14} style={{ color: '#087b58' }} /><span style={{ flex: 1 }}>{d.name}</span><span style={{ color: '#9ca3af' }}>{(d.size / 1024).toFixed(0)} KB</span></div>)}</div>}
        </div>
        {detailApp.status !== 'ISSUED' && detailApp.status !== 'APPROVED' && detailApp.status !== 'REJECTED' && <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button onClick={() => { handleApprove(detailApp.trackingNo); setDetailApp(null); }} style={{ flex: 1, padding: '10px', background: '#087b58', color: '#fff', border: 0, borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}><Check size={14} style={{ verticalAlign: -2 }} /> Approve</button>
          <button onClick={() => { handleReject(detailApp.trackingNo); setDetailApp(null); }} style={{ flex: 1, padding: '10px', background: '#dc2626', color: '#fff', border: 0, borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}><XCircle size={14} style={{ verticalAlign: -2 }} /> Reject</button>
        </div>}
      </div>
    </div>}

    <aside className={`sidebar ${side ? 'show' : ''}`}>
      <div className="side-brand"><span className="brand-mark"><Landmark size={19} /></span><span>Digital Seba<small>Office Portal</small></span><button className="side-close" onClick={() => setSide(false)}><X size={17} /></button></div>
      <div className="union-switch"><span>Active Union</span><strong>Union Parishad Office</strong><ChevronDown size={15} /></div>
      <nav className="side-nav" aria-label="Office Menu">
        {menuItems.map(({ key, label, icon: Icon, badge, children }) => <div className="menu-group" key={key}>
          <button className={`menu-main ${activeMenu === key ? 'active' : ''}`} onClick={() => { selectMenu(key, label); if (children) toggle(key); }}><Icon size={17} /><span>{label}</span>{badge && <b>{badge}</b>}{children && (expanded.includes(key) ? <ChevronUp className="menu-chevron" size={14} /> : <ChevronDown className="menu-chevron" size={14} />)}</button>
          {children && expanded.includes(key) && <div className="sub-nav">{children.map((child) => <button className={activeMenu === child.key ? 'active' : ''} key={child.key} onClick={() => selectMenu(child.key, child.label)}><span className="sub-dot" />{child.label}</button>)}</div>}
        </div>)}
      </nav>
      <div className="side-bottom"><button onClick={() => selectMenu('settings', 'Settings')}><Settings size={17} />Settings</button><button onClick={logout}><LogOut size={17} />Logout</button></div>
    </aside>

    <main className="admin-main">
      <header className="admin-top"><button className="mobile-menu" onClick={() => setSide(true)}><Menu size={19} /></button><div><span className="crumb">Home <b>/</b></span><strong>{currentLabel}</strong></div><div className="admin-top-right"><button className="admin-icon" onClick={() => setDark(!dark)}>{dark ? <Sun size={17} /> : <Moon size={17} />}</button><button className="admin-icon notify"><Bell size={17} /><i /></button><button className="user-mini" onClick={() => setUserMenu(!userMenu)}><span>SA</span><div><strong>Secretary Admin</strong><small>Union Admin</small></div><ChevronDown size={14} /></button>{userMenu && <div className="user-popover"><strong>Secretary Admin</strong><span>office@digitalseba.local</span><button>View Profile</button><button onClick={logout}>Logout</button></div>}</div></header>
      <div className="dash-content">
        {activeMenu === 'dashboard' ? <DashboardHome applications={applications} /> : <ModuleWorkspace active={activeMenu} label={currentLabel} applications={applications} onApprove={handleApprove} onReject={handleReject} onViewDetail={openDetail} />}
      </div>
    </main>
  </div>;
}

function DashboardHome({ applications }: { applications: AppRow[] }) {
  const pending = applications.filter((a) => a.status === 'PENDING').length;
  const issued = applications.filter((a) => a.status === 'ISSUED' || a.status === 'APPROVED').length;
  const rejected = applications.filter((a) => a.status === 'REJECTED').length;
  return <>
    <div className="dash-heading"><div><span className="small-label">Good Morning, Secretary</span><h1>Today's Summary</h1></div><button className="export-btn"><ArrowDownRight size={15} /> Export Report</button></div>
    <div className="admin-stats">
      <Stat icon={ClipboardList} value={String(applications.length)} label="Total Applications" change="All time" />
      <Stat icon={ClockIcon} value={String(pending)} label="Pending Review" change="Needs action" />
      <Stat icon={FileCheck2} value={String(issued)} label="Approved / Issued" change="Complete" positive />
      <Stat icon={Activity} value={String(rejected)} label="Rejected" change="Declined" />
    </div>
    <div className="dashboard-grid">
      <section className="dash-card chart-card">
        <div className="card-heading"><div><h2>Application Statistics</h2><p>Overview of all applications</p></div></div>
        <div style={{ padding: 20, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[{ l: 'Pending', v: pending, c: '#f59e0b' }, { l: 'Issued', v: issued, c: '#087b58' }, { l: 'Rejected', v: rejected, c: '#dc2626' }].map((s) => <div key={s.l} style={{ flex: 1, minWidth: 100, textAlign: 'center', padding: 16, background: '#f9fafb', borderRadius: 12 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{s.l}</div>
          </div>)}
        </div>
      </section>
      <section className="dash-card tasks-card">
        <div className="card-heading"><div><h2>Recent Applications</h2><p>Latest submissions</p></div></div>
        <div className="task-list">
          {applications.slice(0, 6).map((app) => <div className="task-item" key={app.trackingNo}>
            <div className="task-icon" style={{ background: app.status === 'ISSUED' || app.status === 'APPROVED' ? '#e8f5ec' : app.status === 'REJECTED' ? '#fef2f2' : '#fff8e1', color: app.status === 'ISSUED' || app.status === 'APPROVED' ? '#087152' : app.status === 'REJECTED' ? '#dc2626' : '#b45309' }}>
              {app.status === 'ISSUED' || app.status === 'APPROVED' ? <Check size={16} /> : app.status === 'REJECTED' ? <XCircle size={16} /> : <ClockIcon size={16} />}
            </div>
            <div><strong>{app.applicant?.fullName || 'Unknown'}</strong><small>{app.trackingNo} · {app.status} · {app.documentCount} docs</small></div>
          </div>)}
          {!applications.length && <div className="task-item"><div className="task-icon yellow"><ClipboardList size={16} /></div><div><strong>No applications yet</strong><small>Applications will appear here</small></div></div>}
        </div>
      </section>
    </div>
  </>;
}

function ModuleWorkspace({ active, label, applications, onApprove, onReject, onViewDetail }: { active: string; label: string; applications: AppRow[]; onApprove: (tn: string) => void; onReject: (tn: string) => void; onViewDetail: (app: AppRow) => void }) {
  const isApplicationsModule = active === 'applications' || active === 'certificate-applications' || active === 'application-review';
  const isReview = active === 'application-review';
  const filtered = isReview ? applications.filter((a) => a.status === 'PENDING') : applications;
  const title = isReview ? 'Application Review' : isApplicationsModule ? 'Service Applications' : label;
  const columns = isApplicationsModule ? ['Tracking No', 'Applicant', 'Service', 'Docs', 'Status'] : ['Name', 'Description', 'Date', 'Status'];
  const values = isApplicationsModule
    ? filtered.map((a) => [a.trackingNo, a.applicant?.fullName || 'Unknown', a.serviceName || 'Certificate', String(a.documentCount), a.status])
    : [['Demo Record', 'Union Parishad Office Portal', '18 September 2026', 'Active']];
  const statuses = isApplicationsModule ? filtered.map((a) => a.status) : [];

  const statusColor = (s: string) => { if (s === 'APPROVED' || s === 'ISSUED') return 'approved'; if (s === 'REJECTED') return 'rejected'; return 'pending'; };

  return <>
    <div className="dash-heading"><div><span className="small-label">Office Management</span><h1>{title}</h1><p>{isReview ? 'Applications awaiting review' : 'Review and manage certificate applications'}</p></div></div>
    <div className="admin-stats">
      <Stat icon={ClipboardList} value={String(applications.length)} label="Total" change="All time" />
      <Stat icon={ClockIcon} value={String(applications.filter((a) => a.status === 'PENDING').length)} label="Pending" change="Action needed" />
      <Stat icon={ShieldCheck} value={String(applications.filter((a) => a.status === 'ISSUED' || a.status === 'APPROVED').length)} label="Issued" change="Complete" positive />
      <Stat icon={Activity} value={String(applications.filter((a) => a.status === 'REJECTED').length)} label="Rejected" change="" />
    </div>
    <section className="dash-card table-card module-table">
      <div className="card-heading"><div><h2>{title} List</h2><p>Click a row to view details & documents</p></div>
        <div className="table-tools"><div className="table-search"><Search size={14} /><input placeholder="Search..." /></div></div>
      </div>
      <div className="table-scroll">
        <table>
          <thead><tr>{columns.map((c) => <th key={c}>{c}</th>)}{isApplicationsModule && <th>Actions</th>}</tr></thead>
          <tbody>
            {filtered.map((app, ri) => <tr key={app.trackingNo} style={{ cursor: 'pointer' }} onClick={() => onViewDetail(app)}>
              {values[ri].map((cell, ci) => <td key={ci}>{ci === values[ri].length - 1 && isApplicationsModule ? <span className={`status ${statusColor(cell)}`}>{cell}</span> : cell}</td>)}
              {isApplicationsModule && <td onClick={(e) => e.stopPropagation()}>
                {statuses[ri] !== 'APPROVED' && statuses[ri] !== 'ISSUED' && statuses[ri] !== 'REJECTED' && <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => onApprove(filtered[ri].trackingNo)} style={{ padding: '4px 10px', background: '#087152', color: '#fff', border: 0, borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><Check size={12} /> Approve</button>
                  <button onClick={() => onReject(filtered[ri].trackingNo)} style={{ padding: '4px 10px', background: '#dc2626', color: '#fff', border: 0, borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><XCircle size={12} /> Reject</button>
                </div>}
                {(statuses[ri] === 'APPROVED' || statuses[ri] === 'ISSUED') && <span style={{ color: '#087152', fontSize: 12, fontWeight: 600 }}><Check size={14} /> Issued</span>}
                {statuses[ri] === 'REJECTED' && <span style={{ color: '#dc2626', fontSize: 12, fontWeight: 600 }}><XCircle size={14} /> Rejected</span>}
              </td>}
            </tr>)}
            {!filtered.length && <tr><td colSpan={columns.length + (isApplicationsModule ? 1 : 0)} style={{ textAlign: 'center', padding: 30, color: '#888' }}>No records found</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  </>;
}

const moduleContent: Record<string, { title: string; subtitle: string; action: string; columns: string[]; values: string[][] }> = {
  'citizen-list': { title: 'Citizen List', subtitle: 'View and verify registered citizens', action: 'New Citizen', columns: ['Name', 'Mobile', 'Union', 'Status'], values: [['Demo Citizen', '01712345678', 'Union 01', 'Verified']] },
  'citizen-verify': { title: 'Citizen Verification', subtitle: 'Review citizen registration applications', action: 'New Verification', columns: ['Applicant', 'NID', 'Submission Date', 'Status'], values: [['Demo Applicant', '1990••••••12', '18 September 2026', 'Pending']] },
  'trade-license': { title: 'Trade License', subtitle: 'Trade license application, issue & renewal management', action: 'New License', columns: ['License No', 'Organization', 'Owner', 'Status'], values: [['TL-001', 'Demo Store', 'Demo Owner', 'Ready']] },
  'holding-assessment': { title: 'Holding Tax Assessment', subtitle: 'Tax determination and assessment by holding', action: 'Assess Tax', columns: ['Holding No', 'Head of Household', 'Annual Value', 'Tax'], values: [['123/45', 'Demo Person', '$25,000', '$1,850']] },
  'non-holding-assessment': { title: 'Non-Holding Tax Assessment', subtitle: 'Tax assessment for non-holding citizens', action: 'Assess Tax', columns: ['Citizen', 'Ward', 'Fiscal Year', 'Tax'], values: [['Demo Citizen', '03', '2025-2026', '$500']] },
  'holding-payment': { title: 'Holding Tax Payment', subtitle: 'Holding tax collection, receipt & arrears management', action: 'Add Payment', columns: ['Receipt No', 'Holding', 'Amount', 'Date'], values: [['RC-001', '123/45', '$650', '18 Sep 2026']] },
  'non-holding-payment': { title: 'Non-Holding Tax Payment', subtitle: 'Verify non-holding tax payments', action: 'Add Payment', columns: ['Receipt No', 'Citizen', 'Amount', 'Status'], values: [['RC-002', 'Demo Citizen', '$500', 'Paid']] },
  'election-area': { title: 'Election Area', subtitle: 'Voter area & election information management', action: 'Add Area', columns: ['Area Code', 'Ward', 'Village', 'Voter'], values: [['U-03', '03', 'Union 01', '1,258']] },
  'profile-create': { title: 'Profile Creation', subtitle: 'Create new citizen and family profiles', action: 'Add Profile', columns: ['Profile No', 'Name', 'Type', 'Status'], values: [['PR-001', 'Demo Person', 'Family', 'Active']] },
  area: { title: 'Area', subtitle: 'Manage geographic structure from district to village', action: 'New Area', columns: ['Name', 'Type', 'Parent', 'Status'], values: [['Union 01', 'Union', 'District 01', 'Active']] },
  'service-reports': { title: 'Service Reports', subtitle: 'All service and application reports', action: 'Export Report', columns: ['Report', 'Period', 'Records', 'Action'], values: [['Summary', 'Sep 2026', '34', 'Download']] },
  'holding-report': { title: 'Holding Tax Report', subtitle: 'Holding tax collection & arrears report', action: 'Download PDF', columns: ['Report', 'Holding', 'Collected', 'Arrears'], values: [['Monthly Report', '2,846', '$42,850', '$18,200']] },
  'non-holding-report': { title: 'Non-Holding Tax Report', subtitle: 'Non-holding tax collection report', action: 'Download Report', columns: ['Report', 'Citizen', 'Collected', 'Arrears'], values: [['Sep Report', '432', '$12,400', '$3,200']] },
  'license-report': { title: 'Trade License Report', subtitle: 'License issue & renewal report', action: 'Download Report', columns: ['Report', 'License', 'New', 'Renewed'], values: [['Monthly Report', '476', '32', '87']] },
  'users-list': { title: 'User List', subtitle: 'Office user & staff accounts', action: 'Add User', columns: ['Name', 'Email', 'Role', 'Status'], values: [['Secretary Admin', 'office@digitalseba.local', 'UNION_ADMIN', 'Active']] },
  roles: { title: 'Roles & Permissions', subtitle: 'Control user access', action: 'New Role', columns: ['Role', 'User', 'Permissions', 'Status'], values: [['UNION_ADMIN', '2', 'All Union Modules', 'Active']] },
};

function ClockIcon(props: { size?: number }) { return <svg {...props} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>; }
function Stat({ icon: Icon, value, label, change, positive = false }: { icon: React.ComponentType<{ size?: number }>; value: string; label: string; change: string; positive?: boolean }) { return <div className="admin-stat"><span className="admin-stat-icon"><Icon size={19} /></span><div><span>{label}</span><strong>{value}</strong><small className={positive ? 'positive' : ''}>{positive && <ArrowUpRight size={11} />}{change}</small></div></div>; }
