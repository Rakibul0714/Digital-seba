'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, BriefcaseBusiness, ChevronDown, ChevronUp,
  CircleDollarSign, ClipboardList, Check, FileCheck2, FileText, Landmark, LayoutDashboard, LogOut, MapPinned,
  Menu, Moon, MoreHorizontal, Search, Settings, ShieldCheck, Sun, UsersRound, UserRound, X, XCircle,
} from 'lucide-react';

type AppRow = { id: string; trackingNo: string; serviceName: string; applicant: Record<string, string>; status: string; createdAt: string };

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

export default function Dashboard() {
  const [dark, setDark] = useState(false);
  const [side, setSide] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [expanded, setExpanded] = useState<string[]>(['tax-payment', 'applications']);
  const [userMenu, setUserMenu] = useState(false);
  const [applications, setApplications] = useState<AppRow[]>([]);
  const currentLabel = menuItems.flatMap((item) => [item, ...(item.children ?? []).map((child) => ({ ...item, ...child, icon: item.icon }))]).find((item) => item.key === activeMenu)?.label ?? 'Dashboard';

  const adminBase = typeof window !== 'undefined' ? `${window.location.origin}/admin` : '';

  const authHeaders = useCallback((): Record<string, string> => {
    const token = localStorage.getItem('accessToken');
    const h: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  }, []);

  const fetchApplications = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/admin/applications', { headers: authHeaders() });
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
  }, [fetchApplications, adminBase]);

  const handleApprove = async (trackingNo: string) => {
    try {
      await fetch(`/api/v1/admin/applications/${trackingNo}/approve`, { method: 'PATCH', headers: authHeaders() });
      setApplications((prev) => prev.map((a) => a.trackingNo === trackingNo ? { ...a, status: 'APPROVED' } : a));
    } catch { /* ignore */ }
  };

  const handleReject = async (trackingNo: string) => {
    try {
      await fetch(`/api/v1/admin/applications/${trackingNo}/reject`, { method: 'PATCH', headers: authHeaders() });
      setApplications((prev) => prev.map((a) => a.trackingNo === trackingNo ? { ...a, status: 'REJECTED' } : a));
    } catch { /* ignore */ }
  };

  const selectMenu = (key: string, label: string) => { setActiveMenu(key); setSide(false); if (key !== 'dashboard') setUserMenu(false); };
  const toggle = (key: string) => setExpanded((items) => items.includes(key) ? items.filter((item) => item !== key) : [...items, key]);
  const logout = () => { localStorage.removeItem('accessToken'); localStorage.removeItem('user'); window.location.href = `${adminBase}/login`; };

  return <div className={`admin-shell ${dark ? 'admin-dark' : ''}`}>
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
        {activeMenu === 'dashboard' ? <DashboardHome applications={applications} /> : <ModuleWorkspace active={activeMenu} label={currentLabel} applications={applications} onApprove={handleApprove} onReject={handleReject} />}
      </div>
    </main>
  </div>;
}

function DashboardHome({ applications }: { applications: AppRow[] }) {
  const pending = applications.filter((a) => a.status === 'PENDING').length;
  const approved = applications.filter((a) => a.status === 'APPROVED' || a.status === 'ISSUED').length;
  return <>
    <div className="dash-heading">
      <div>
        <span className="small-label">Good Morning, Secretary</span>
        <h1>Today's Summary</h1>
      </div>
      <button className="export-btn"><ArrowDownRight size={15} /> Export Report</button>
    </div>
    <div className="admin-stats">
      <Stat icon={ClipboardList} value={String(applications.length || 34)} label="Total Applications" change="+12.4%" positive />
      <Stat icon={ClockIcon} value={String(pending || 12)} label="Pending" change="Needs Attention" />
      <Stat icon={FileCheck2} value={String(approved || 28)} label="Approved" change="+8.2%" positive />
      <Stat icon={Activity} value="$42,850" label="This Month's Tax" change="+18.7%" positive />
    </div>
    <div className="dashboard-grid">
      <section className="dash-card chart-card">
        <div className="card-heading">
          <div>
            <h2>Application Statistics</h2>
            <p>Comparative chart of last 6 months</p>
          </div>
          <button className="period-btn">This 6 Months <ChevronDown size={14} /></button>
        </div>
        <div className="chart">
          <div className="y-labels"><span>60</span><span>40</span><span>20</span><span>0</span></div>
          <div className="chart-area">
            <div className="gridline g1" /><div className="gridline g2" /><div className="gridline g3" /><div className="gridline g4" />
            <svg viewBox="0 0 600 220" preserveAspectRatio="none" className="line-chart">
              <path d="M0,160 C55,147 64,168 105,131 S156,105 205,126 S258,113 300,93 S352,118 403,83 S463,57 505,68 S550,41 600,22" fill="none" stroke="#087b58" strokeWidth="3" />
              <path d="M0,160 C55,147 64,168 105,131 S156,105 205,126 S258,113 300,93 S352,118 403,83 S463,57 505,68 S550,41 600,22 L600,220 L0,220Z" fill="url(#fill)" opacity=".17" />
              <defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#087b58" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient></defs>
            </svg>
            <div className="x-labels"><span>April</span><span>May</span><span>June</span><span>July</span><span>August</span><span>September</span></div>
          </div>
        </div>
      </section>
      <section className="dash-card tasks-card">
        <div className="card-heading">
          <div>
            <h2>Recent Applications</h2>
            <p>Latest submissions</p>
          </div>
        </div>
        <div className="task-list">
          {applications.slice(0, 5).map((app) => <div className="task-item" key={app.trackingNo}>
            <div className="task-icon" style={{ background: app.status === 'APPROVED' ? '#e8f5ec' : app.status === 'REJECTED' ? '#fef2f2' : '#fff8e1', color: app.status === 'APPROVED' ? '#087152' : app.status === 'REJECTED' ? '#dc2626' : '#b45309' }}>
              {app.status === 'APPROVED' ? <Check size={16} /> : app.status === 'REJECTED' ? <XCircle size={16} /> : <ClockIcon size={16} />}
            </div>
            <div>
              <strong>{app.applicant?.fullName || 'Unknown'}</strong>
              <small>{app.trackingNo} · {app.status}</small>
            </div>
          </div>)}
          {!applications.length && <>
            <div className="task-item"><div className="task-icon yellow"><ClipboardList size={16} /></div><div><strong>No applications yet</strong><small>Applications will appear here</small></div></div>
          </>}
        </div>
      </section>
    </div>
  </>;
}

function ModuleWorkspace({ active, label, applications, onApprove, onReject }: { active: string; label: string; applications: AppRow[]; onApprove: (tn: string) => void; onReject: (tn: string) => void }) {
  const isApplicationsModule = active === 'applications' || active === 'certificate-applications' || active === 'application-review';

  let columns: string[];
  let values: string[][];
  let trackingNos: string[];
  let statuses: string[];
  let title: string;
  let subtitle: string;
  let action: string;

  if (isApplicationsModule) {
    title = active === 'application-review' ? 'Application Review' : 'Service Applications';
    subtitle = active === 'application-review' ? 'Applications awaiting review' : 'Review and approve certificate applications';
    action = 'View All';
    columns = ['Tracking No', 'Applicant', 'Service', 'Status'];
    const filtered = active === 'application-review' ? applications.filter((a) => a.status === 'PENDING') : applications;
    values = filtered.map((a) => [a.trackingNo, a.applicant?.fullName || 'Unknown', a.serviceName || 'Certificate', a.status]);
    trackingNos = filtered.map((a) => a.trackingNo);
    statuses = filtered.map((a) => a.status);
  } else {
    const content = moduleContent[active] ?? { title: label, subtitle: 'Information & management for this module', action: 'Add New', columns: ['Name', 'Description', 'Date', 'Status'], values: [['Demo Record', 'Union Parishad Office Portal', '18 September 2026', 'Active']] };
    title = content.title;
    subtitle = content.subtitle;
    action = content.action;
    columns = content.columns;
    values = content.values;
    trackingNos = [];
    statuses = [];
  }

  const statusColor = (s: string) => {
    if (s === 'APPROVED' || s === 'ISSUED') return 'approved';
    if (s === 'REJECTED') return 'rejected';
    return 'pending';
  };

  return <>
    <div className="dash-heading">
      <div>
        <span className="small-label">Office Management</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <button className="export-btn"><ArrowRight size={15} /> {action}</button>
    </div>
    <div className="admin-stats">
      <Stat icon={ClipboardList} value={String(applications.length || 12)} label="Total Records" change="This Month" />
      <Stat icon={ClockIcon} value={String(applications.filter((a) => a.status === 'PENDING').length || 4)} label="Pending" change="Needs Attention" />
      <Stat icon={ShieldCheck} value={String(applications.filter((a) => a.status === 'APPROVED').length || 28)} label="Completed" change="This Month" positive />
      <Stat icon={Activity} value="98%" label="Service Quality" change="Good" positive />
    </div>
    <section className="dash-card table-card module-table">
      <div className="card-heading">
        <div>
          <h2>{title} List</h2>
          <p>Search, filter & record management</p>
        </div>
        <div className="table-tools">
          <div className="table-search"><Search size={14} /><input placeholder="Search..." /></div>
        </div>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {columns.map((column) => <th key={column}>{column}</th>)}
              {isApplicationsModule && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {values.map((value, rowIndex) => <tr key={rowIndex}>
              {value.map((cell, index) => <td key={index}>{index === value.length - 1 && isApplicationsModule ? <span className={`status ${statusColor(cell)}`}>{cell}</span> : cell}</td>)}
              {isApplicationsModule && <td>
                {statuses[rowIndex] !== 'APPROVED' && statuses[rowIndex] !== 'ISSUED' && statuses[rowIndex] !== 'REJECTED' && <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => onApprove(trackingNos[rowIndex])} style={{ padding: '5px 10px', background: '#087152', color: '#fff', border: '0', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={13} /> Approve</button>
                  <button onClick={() => onReject(trackingNos[rowIndex])} style={{ padding: '5px 10px', background: '#dc2626', color: '#fff', border: '0', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><XCircle size={13} /> Reject</button>
                </div>}
                {(statuses[rowIndex] === 'APPROVED' || statuses[rowIndex] === 'ISSUED') && <span style={{ color: '#087152', fontSize: '12px', fontWeight: '600' }}><Check size={14} /> Approved</span>}
                {statuses[rowIndex] === 'REJECTED' && <span style={{ color: '#dc2626', fontSize: '12px', fontWeight: '600' }}><XCircle size={14} /> Rejected</span>}
              </td>}
            </tr>)}
            {!values.length && <tr><td colSpan={columns.length + (isApplicationsModule ? 1 : 0)} style={{ textAlign: 'center', padding: '30px', color: '#888' }}>No records found</td></tr>}
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
