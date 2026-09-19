'use client';

import { FormEvent, useMemo, useRef, useState } from 'react';
import {
  Accessibility, ArrowRight, ArrowUpRight, BadgeCheck, BriefcaseBusiness, Building2, CalendarDays, Check, CheckCircle2,
  ChevronRight, CircleDollarSign, ClipboardCheck, Clock3, Copy, CreditCard, Download, FileCheck2,
  FileText, FileX2, GitBranch, Globe2, Heart, HeartOff, Home, Landmark, LandPlot, Mail, MapPin, MapPinned,
  Medal, Menu, Moon, Phone, PlugZap, QrCode, ScanLine, Search, Send, ShieldCheck, Smartphone,
  Sparkles, Store, Sun, UploadCloud, UserPlus, UserRound, UserRoundX, UsersRound, Waves, X, Zap,
} from 'lucide-react';

type Service = { id: number; name: string; type: 'certificate' | 'license' };

const services: Service[] = [
  { id: 1, name: 'Citizen Certificate Application', type: 'certificate' },
  { id: 2, name: 'Heir Certificate Application', type: 'certificate' },
  { id: 3, name: 'Character Certificate Application', type: 'certificate' },
  { id: 4, name: 'Death Certificate Application', type: 'certificate' },
  { id: 5, name: 'No Re-marriage Certificate', type: 'certificate' },
  { id: 6, name: 'Disability Certificate Application', type: 'certificate' },
  { id: 7, name: 'Electricity Connection Certificate', type: 'certificate' },
  { id: 8, name: 'Voter Area Transfer Clearance', type: 'certificate' },
  { id: 9, name: 'Guardian Income Application', type: 'certificate' },
  { id: 10, name: 'Freedom Fighter Application', type: 'certificate' },
  { id: 11, name: 'Freedom Fighter Child Application', type: 'certificate' },
  { id: 12, name: 'Same Name Application', type: 'certificate' },
  { id: 13, name: 'Ethnic Minority Application', type: 'certificate' },
  { id: 14, name: 'Profession Related Application', type: 'certificate' },
  { id: 15, name: 'Heirship Certificate Application', type: 'certificate' },
  { id: 16, name: 'Unmarried Certificate Application', type: 'certificate' },
  { id: 17, name: 'Certification Application', type: 'certificate' },
  { id: 18, name: 'Landless Certificate Application', type: 'certificate' },
  { id: 19, name: 'National ID Card Correction', type: 'certificate' },
  { id: 20, name: 'New Voter Registration Certificate', type: 'certificate' },
  { id: 21, name: 'Childless Certificate Application', type: 'certificate' },
  { id: 22, name: 'No Electricity Connection Application', type: 'certificate' },
  { id: 23, name: 'Char Area No Electricity Application', type: 'certificate' },
  { id: 24, name: 'Trade License Application', type: 'license' },
];

const serviceIcons = [
  UserRound, UsersRound, BadgeCheck, FileX2, HeartOff, Accessibility,
  Zap, MapPinned, CircleDollarSign, Medal, ShieldCheck, Copy,
  UsersRound, BriefcaseBusiness, GitBranch, Heart, FileCheck2, LandPlot,
  ScanLine, UserPlus, UserRoundX, PlugZap, Waves, Store,
];

const stats = [
  { label: 'Active Unions', value: 2, icon: Landmark },
  { label: 'Total Holdings', value: 2846, icon: Home },
  { label: 'Citizen Certificates', value: 1298, icon: FileText },
  { label: 'Trade Licenses', value: 476, icon: CreditCard },
  { label: 'Heir Certificates', value: 318, icon: UsersRound },
  { label: 'Character Certificates', value: 862, icon: BadgeCheck },
  { label: 'Unmarried Certificates', value: 214, icon: FileCheck2 },
];

function Brand() {
  return <a href="/" className="brand" aria-label="Digital Seba Homepage">
    <span className="brand-mark"><Landmark size={20} strokeWidth={2.3} /></span>
    <span><span className="brand-name">Digital Seba</span><span className="brand-sub">Digital Union Parishad</span></span>
  </a>;
}

function TopNav({ dark, setDark, onTrack }: { dark: boolean; setDark: (value: boolean) => void; onTrack: () => void }) {
  const [open, setOpen] = useState(false);
  return <>
    <div className="topline"><div className="container topline-inner">
      <div className="topline-left"><span className="topline-item"><Phone size={12} /> +880 1788812345</span><span className="topline-item"><Mail size={12} /> hello@digitalseba.org</span></div>
      <div className="topline-right"><span>Need Help?</span><span className="dot" /><span>Bangla</span><span>English</span></div>
    </div></div>
    <header className="navbar"><div className="container nav-inner">
      <Brand />
      <nav className={`nav-links ${open ? 'is-open' : ''}`}>
        <a href="#services" onClick={() => setOpen(false)}>Services</a>
        <a href="#how-it-works" onClick={() => setOpen(false)}>How It Works</a>
        <a href="/notices" onClick={() => setOpen(false)}>Notices</a>
        <a href="/contact-us" onClick={() => setOpen(false)}>Contact</a>
      </nav>
      <div className="nav-actions">
        <button className="icon-btn" aria-label="Toggle theme" onClick={() => setDark(!dark)}>{dark ? <Sun size={17} /> : <Moon size={17} />}</button>
        <button className="icon-btn mobile-nav-toggle" aria-label="Menu" onClick={() => setOpen(!open)}>{open ? <X size={18} /> : <Menu size={18} />}</button>
        <a className="login-btn" href="/login"><ShieldCheck size={15} /> Office Login</a>
      </div>
    </div></header>
  </>;
}

function NoticeStrip() {
  return <div className="notice-strip"><div className="container notice-inner"><span className="notice-pill"><Sparkles size={12} /> New</span><span className="notice-text">Welcome to the Digital Seba Platform — all Union Parishad services are now online.</span><a href="/notices" className="notice-link">All Notices <ArrowRight size={13} /></a></div></div>;
}

function Hero({ onTrack, onService }: { onTrack: () => void; onService: (service: Service) => void }) {
  return <section className="hero"><div className="container hero-grid">
    <div>
      <span className="eyebrow"><span className="eyebrow-dot" /> Union Parishad Digital Service</span>
      <h1>Services are now<br /><span>Digital</span> and Easy.</h1>
      <p className="hero-copy">Currently, all services of one Union in Paba Upazila of Rajshahi District and one Union in Sadar Upazila of Chapainawabganj District are provided online on the Digital Seba platform.</p>
      <div className="hero-actions"><a className="primary-btn" href="#services">Choose a Service <ArrowRight size={17} /></a><button className="secondary-btn" onClick={onTrack}><ClipboardCheck size={16} /> Track Application</button></div>
      <div className="trust-row"><span className="trust-item"><CheckCircle2 size={14} /> Secure & Verified</span><span className="trust-item"><Clock3 size={14} /> 24/7 Application</span><span className="trust-item"><Smartphone size={14} /> Mobile Friendly</span></div>
    </div>
    <div className="hero-visual"><div className="visual-orb" />
      <div className="floating-card one"><CheckCircle2 size={16} /> Application Submitted Successfully</div>
      <div className="floating-card two"><QrCode size={16} /> Verify with QR</div>
      <div className="service-preview">
        <div className="preview-top"><span className="preview-logo"><span className="mini-mark"><Landmark size={13} /></span> Digital Seba</span><span className="preview-label">Today's Services</span></div>
        <div className="preview-stat"><div><strong>86</strong><p>Applications Completed Today</p></div><span className="trend">↑ 12.4%</span></div>
        <div className="preview-card"><div className="preview-card-head"><span>Service Usage Chart</span><span>This Week</span></div><div className="bars"><i className="bar" /><i className="bar" /><i className="bar" /><i className="bar active" /><i className="bar" /><i className="bar active" /><i className="bar" /></div><div className="bar-days"><span>Sat</span><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span></div></div>
      </div>
    </div>
  </div></section>;
}

function StatsSection() {
  return <section className="section" style={{ paddingBottom: 55 }}><div className="container">
    <div className="section-head"><div><div className="section-kicker">Our Progress</div><h2 className="section-title">Digital Seba at a Glance</h2></div><p className="section-desc">We are moving forward with three goals in mind: transparency, speed, and citizen comfort.</p></div>
    <div className="stats-grid">{stats.slice(0, 4).map((item) => { const Icon = item.icon; return <div className="stat-card" key={item.label}><div className="stat-icon"><Icon size={19} /></div><div><div className="stat-value">{item.value}{item.label === 'Active Unions' ? '' : '+'}</div><div className="stat-label">{item.label}</div></div></div>; })}</div>
  </div></section>;
}

function QuickActions() {
  const actions = [
    { title: 'Citizen Corner', text: 'All online services in one place', icon: UserRound, href: '/citizen-corner' },
    { title: 'Certificate Download', text: 'Search by certificate number', icon: Download, href: '/certificate-download' },
    { title: 'Pay Tax', text: 'Pay holding tax easily', icon: CircleDollarSign, href: '/holding-tax/check' },
    { title: 'Contact Us', text: 'Send a message directly to the office', icon: Send, href: '/contact-us' },
  ];
  return <section className="section section-muted" style={{ paddingTop: 57, paddingBottom: 67 }}><div className="container">
    <div className="section-head"><div><div className="section-kicker">Quick Access</div><h2 className="section-title">Your Required Services</h2></div><p className="section-desc">Start any service you need with a single click.</p></div>
    <div className="quick-grid">{actions.map(({ title, text, icon: Icon, href }) => <a href={href} className="quick-card" key={title}><div className="quick-top"><span className="quick-icon"><Icon size={19} /></span><span className="arrow-circle"><ArrowUpRight size={15} /></span></div><h3>{title}</h3><p>{text}</p></a>)}</div>
  </div></section>;
}

function ServicesSection({ onService }: { onService: (service: Service) => void }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => services.filter((service) => service.name.includes(query.trim())), [query]);
  return <section className="section" id="services"><div className="container">
    <div className="section-head"><div><div className="section-kicker">Service List</div><h2 className="section-title">Our Services</h2><p className="section-desc">Apply online, track progress, and receive certificates from home.</p></div><a className="section-link" href="/citizen-corner">View All Services <ChevronRight size={15} /></a></div>
    <div className="service-toolbar"><div className="search-box"><Search size={16} /><input aria-label="Search services" placeholder="Search by service name..." value={query} onChange={(e) => setQuery(e.target.value)} /></div><span className="service-count">{filtered.length} services found</span></div>
    <div className="service-grid">{filtered.map((service) => { const ServiceIcon = serviceIcons[service.id - 1] ?? FileText; return <button className="service-card" key={service.id} onClick={() => onService(service)}><span className="service-number service-icon" aria-label={`${service.name} icon`}><ServiceIcon size={16} strokeWidth={1.9} /></span><h3>{service.name}</h3><span className="service-apply">Apply Now <ArrowRight size={12} /></span></button>; })}</div>
    {!filtered.length && <div className="empty-state">No service found with this name. Try searching differently.</div>}
  </div></section>;
}

function TrackingSection({ onTrack }: { onTrack: () => void }) {
  return <section className="tracking-section"><div className="container tracking-grid"><div><div className="section-kicker">Keep Track of Applications</div><h2 className="section-title">Where is your application?</h2><p className="section-desc">View progress anytime using the tracking number provided at application time.</p><div className="tracking-form"><input placeholder="e.g. SS-HARI-2026-004281" aria-label="Tracking number" /><button onClick={onTrack}>Track Now</button></div></div><div className="timeline"><div className="timeline-step"><div className="timeline-dot done"><Check size={17} /></div><strong>Submitted</strong><span>Completed</span></div><div className="timeline-step"><div className="timeline-dot done"><Check size={17} /></div><strong>Verified</strong><span>Completed</span></div><div className="timeline-step"><div className="timeline-dot"><Clock3 size={16} /></div><strong>Approval</strong><span>In Progress</span></div><div className="timeline-step"><div className="timeline-dot"><Download size={15} /></div><strong>Delivery</strong><span>Next Step</span></div></div></div></section>;
}

function DownloadsSection() {
  return <section className="section section-muted"><div className="container"><div className="section-head"><div><div className="section-kicker">Digital Documents</div><h2 className="section-title">Download & Verify</h2></div><p className="section-desc">Verify the authenticity of your certificate or license anytime.</p></div><div className="download-grid"><div className="download-card"><div><h3>Certificate Download</h3><p>Find your digital certificate by certificate number and download the PDF.</p><a className="primary-btn" href="/certificate-download">Search Certificate <ArrowRight size={15} /></a></div><div className="download-art"><FileText size={32} /></div></div><div className="download-card red-accent"><div><h3>License Verification</h3><p>Verify trade license information using the trade license number.</p><a className="secondary-btn" href="/license-download">License Verification <QrCode size={15} /></a></div><div className="download-art"><QrCode size={32} /></div></div></div></div></section>;
}

function ProcessSection() {
  const items = [{ n: '01', t: 'Choose a Service', d: 'Find the service you need from the list.' }, { n: '02', t: 'Fill in Information', d: 'Provide your correct information and documents in the simple form.' }, { n: '03', t: 'Receive Certificate', d: 'Once the application is approved, receive an SMS and download the certificate.' }];
  return <section className="section" id="how-it-works"><div className="container"><div className="section-head"><div><div className="section-kicker">In Just Three Steps</div><h2 className="section-title">Getting Services is Now Much Easier</h2></div></div><div className="process-grid">{items.map((item) => <div className="process-card" key={item.n}><div className="process-index">{item.n}</div><h3>{item.t}</h3><p>{item.d}</p></div>)}</div></div></section>;
}

function Footer() {
  return <footer className="footer"><div className="container"><div className="footer-grid"><div><Brand /><p className="footer-desc">Digital Seba is by your side to deliver all Union Parishad citizen services easily, quickly, and transparently.</p><div className="socials"><a href="https://www.facebook.com" aria-label="Facebook"><Globe2 size={15} /></a><a href="mailto:hello@digitalseba.org" aria-label="Email"><Mail size={15} /></a><a href="tel:+8801788812345" aria-label="Phone"><Phone size={15} /></a></div></div><div><h4>Quick Links</h4><ul className="footer-links"><li><a href="#services">All Services</a></li><li><a href="/certificate-download">Certificate Verification</a></li><li><a href="/holding-tax/check">Holding Tax</a></li><li><a href="/notices">Notice Board</a></li></ul></div><div><h4>Important</h4><ul className="footer-links"><li><a href="/contact-us">Contact</a></li><li><a href="/login">Office Login</a></li><li><a href="/track/demo">Track Application</a></li><li><a href="/verify/demo">QR Verification</a></li></ul></div><div><h4>Contact</h4><div className="contact-line"><Phone size={14} /> +880 1788812345</div><div className="contact-line"><Mail size={14} /> hello@digitalseba.org</div><div className="contact-line"><MapPin size={14} /> Digital Seba Parishad, Rajshahi</div></div></div><div className="footer-bottom"><span>© 2026, Digital Seba. All Rights Reserved</span><span>Technical Support by Digital Seba Team</span></div></div></footer>;
}

const stepStyle = { display: 'flex', flexDirection: 'column' as const, gap: 12, padding: '16px 0' };
const fieldStyle = { display: 'flex', flexDirection: 'column' as const, gap: 6 };
const labelStyle = { fontSize: 13, fontWeight: 600, color: '#374151' };
const inputStyle = { padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 10, fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box' as const };
const fileBoxStyle = { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: 8, padding: '24px 16px', border: '2px dashed #d1d5db', borderRadius: 12, cursor: 'pointer', background: '#f9fafb', transition: 'border-color 0.2s' };
const fileItemStyle = { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, fontSize: 13 };
const stepBtnRow = { display: 'flex', justifyContent: 'space-between', gap: 10, paddingTop: 12, borderTop: '1px solid #e5e7eb', marginTop: 8 };
const primaryBtn = { padding: '10px 22px', background: '#087b58', color: '#fff', border: 0, borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 };
const secondaryBtn = { padding: '10px 22px', background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' };

function ServiceModal({ service, onClose }: { service: Service; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [trackingNo, setTrackingNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ nid: '', name: '', guardian: '', mother: '', mobile: '', union: 'union-01', ward: '01', holding: '', address: '' });
  const set = (key: string, val: string) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const added = Array.from(newFiles).filter((f) => f.size <= 5 * 1024 * 1024);
    setFiles((prev) => [...prev, ...added].slice(0, 5));
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const canNextStep2 = form.nid.trim() && form.name.trim() && form.guardian.trim() && form.mother.trim() && form.mobile.trim() && form.address.trim();

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/v1/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceSlug: `service-${service.id}`,
          fullName: form.name || form.nid || 'Unknown',
          mobile: form.mobile,
          unionId: form.union,
          nid: form.nid,
          fatherName: form.guardian,
          motherName: form.mother,
          address: form.address,
          ward: form.ward,
          holdingNo: form.holding,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to submit application');

      if (files.length > 0 && result.trackingNo) {
        const docForm = new FormData();
        files.forEach((f) => docForm.append('documents', f));
        await fetch(`/api/v1/applications/${result.trackingNo}/documents`, { method: 'POST', body: docForm });
      }

      setTrackingNo(result.trackingNo);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return <div className="modal-backdrop" role="dialog" aria-modal="true"><div className="modal" style={{ maxWidth: 560 }}>
    {!submitted ? <><div className="modal-head"><div><h2>{service.name}</h2><p className="modal-sub">Complete the steps below to apply. Your information will be securely stored.</p></div><button className="close-btn" onClick={onClose} aria-label="Close"><X size={17} /></button></div>

      <div style={{ display: 'flex', gap: 8, padding: '0 0 16px' }}>
        {['Service Selection', 'Fill Information', 'Documents'].map((label, i) => {
          const num = i + 1;
          const isActive = step === num;
          const isDone = step > num;
          return <div key={label} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 10, background: isActive ? '#ecfdf5' : isDone ? '#f0fdf4' : '#f9fafb', border: `1px solid ${isActive ? '#087b58' : isDone ? '#bbf7d0' : '#e5e7eb'}` }}>
            <span style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, background: isDone ? '#087b58' : isActive ? '#087b58' : '#d1d5db', color: '#fff', flexShrink: 0 }}>{isDone ? <Check size={13} /> : num}</span>
            <span style={{ fontSize: 12, fontWeight: isActive ? 700 : 500, color: isActive ? '#087b58' : '#6b7280' }}>{label}</span>
          </div>;
        })}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); submit(); }}>

        {step === 1 && <div style={stepStyle}>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <CheckCircle2 size={20} style={{ color: '#087b58' }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#087b58' }}>{service.name}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>Service Fee: ৳50</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>Please confirm you want to apply for this service. You will need your NID number and personal information in the next step.</p>
          </div>
          <div style={stepBtnRow}>
            <button type="button" onClick={onClose} style={secondaryBtn}>Cancel</button>
            <button type="button" onClick={() => setStep(2)} style={primaryBtn}>Next Step <ArrowRight size={15} /></button>
          </div>
        </div>}

        {step === 2 && <div style={stepStyle}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={fieldStyle}><label style={labelStyle}>NID Number</label><input value={form.nid} onChange={(e) => set('nid', e.target.value)} placeholder="10 or 17 digit NID" required style={inputStyle} /></div>
            <div style={fieldStyle}><label style={labelStyle}>Full Name</label><input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Your full name" required style={inputStyle} /></div>
            <div style={fieldStyle}><label style={labelStyle}>Father/Husband's Name</label><input value={form.guardian} onChange={(e) => set('guardian', e.target.value)} placeholder="Father or Husband's Name" required style={inputStyle} /></div>
            <div style={fieldStyle}><label style={labelStyle}>Mother's Name</label><input value={form.mother} onChange={(e) => set('mother', e.target.value)} placeholder="Mother's Name" required style={inputStyle} /></div>
            <div style={fieldStyle}><label style={labelStyle}>Mobile Number</label><input value={form.mobile} onChange={(e) => set('mobile', e.target.value)} placeholder="01788812345" required style={inputStyle} /></div>
            <div style={fieldStyle}><label style={labelStyle}>Union</label><select value={form.union} onChange={(e) => set('union', e.target.value)} style={inputStyle}><option value="union-01">Union 01</option><option value="union-02">Union 02</option></select></div>
            <div style={fieldStyle}><label style={labelStyle}>Ward</label><select value={form.ward} onChange={(e) => set('ward', e.target.value)} style={inputStyle}><option value="01">Ward 01</option><option value="02">Ward 02</option><option value="03">Ward 03</option><option value="04">Ward 04</option><option value="05">Ward 05</option></select></div>
            <div style={fieldStyle}><label style={labelStyle}>Holding Number</label><input value={form.holding} onChange={(e) => set('holding', e.target.value)} placeholder="e.g. 123/45" style={inputStyle} /></div>
          </div>
          <div style={fieldStyle}><label style={labelStyle}>Current Address</label><textarea value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Village, Post Office, Ward, Union" required style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} /></div>
          <div style={stepBtnRow}>
            <button type="button" onClick={() => setStep(1)} style={secondaryBtn}>Back</button>
            <button type="button" onClick={() => setStep(3)} disabled={!canNextStep2} style={{ ...primaryBtn, opacity: canNextStep2 ? 1 : 0.5 }}>Next Step <ArrowRight size={15} /></button>
          </div>
        </div>}

        {step === 3 && <div style={stepStyle}>
          <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>Upload supporting documents (NID copy, photos, etc.). Maximum 5 files, 5MB each.</p>

          <div style={{ ...fileBoxStyle, borderColor: files.length ? '#087b58' : '#d1d5db' }} onClick={() => fileInputRef.current?.click()}>
            <UploadCloud size={28} style={{ color: '#9ca3af' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Click to upload documents</span>
            <span style={{ fontSize: 11, color: '#9ca3af' }}>NID Copy, Photo, Supporting Letters (PDF, JPG, PNG)</span>
          </div>
          <input ref={fileInputRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={(e) => handleFiles(e.target.files)} />

          {files.length > 0 && <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {files.map((f, i) => <div key={i} style={fileItemStyle}>
              <FileText size={16} style={{ color: '#087b58', flexShrink: 0 }} />
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>{(f.size / 1024).toFixed(0)} KB</span>
              <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(i); }} style={{ background: 'none', border: 0, cursor: 'pointer', color: '#dc2626', padding: 2 }}><X size={14} /></button>
            </div>)}
          </div>}

          {error && <p style={{ color: '#dc2626', fontSize: 13, background: '#fef2f2', padding: '8px 12px', borderRadius: 8, margin: 0 }}>{error}</p>}

          <div style={stepBtnRow}>
            <button type="button" onClick={() => setStep(2)} style={secondaryBtn}>Back</button>
            <button type="submit" disabled={loading} style={{ ...primaryBtn, opacity: loading ? 0.6 : 1 }}>{loading ? 'Submitting...' : 'Submit Application'} {!loading && <Send size={15} />}</button>
          </div>
        </div>}

      </form></>

      : <div style={{ textAlign: 'center', padding: 30 }}><div className="success-icon"><CheckCircle2 size={32} /></div><h2>Application Submitted Successfully</h2><p style={{ color: '#555', margin: '10px 0' }}>Tracking Number: <strong>{trackingNo}</strong></p><p style={{ color: '#777', fontSize: 13 }}>Save this number. You can track your application status anytime.</p><button className="primary-btn" onClick={onClose} style={{ marginTop: 20 }}>Close</button></div>}
  </div></div>;
}

function TrackModal({ onClose }: { onClose: () => void }) {
  const [tracking, setTracking] = useState('');
  const [result, setResult] = useState<{ trackingNo: string; service: string; status: string; createdAt: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!tracking.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await fetch(`/api/v1/applications/track/${encodeURIComponent(tracking)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Application not found');
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return <div className="modal-backdrop"><div className="modal"><div className="modal-head"><div><h2>Track Application</h2><p className="modal-sub">Check the current status of your application using your tracking number.</p></div><button className="close-btn" onClick={onClose}><X size={17} /></button></div><div className="field"><label htmlFor="tracking">Tracking Number</label><input id="tracking" value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="e.g. SS-HARI-2026-004281" /></div>{result && <div style={{ marginTop: 20, background: '#eff8f0', border: '1px solid #c7e3ce', borderRadius: 14, padding: 16 }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}><strong style={{ color: '#17654e', fontSize: 14 }}>Application Verified</strong><span style={{ color: '#07855a', fontSize: 11, fontWeight: 800 }}>{result.status}</span></div><p style={{ color: '#769187', fontSize: 12, margin: '9px 0 0' }}>{result.service} · Tracking: {result.trackingNo}</p></div>}{error && <p style={{ color: '#dc2626', fontSize: 13, marginTop: 10 }}>{error}</p>}<div className="modal-foot"><button className="secondary-btn" onClick={onClose}>Close</button><button className="primary-btn" onClick={handleSearch} disabled={!tracking.trim() || loading}>{loading ? 'Searching...' : 'Search'} <Search size={15} /></button></div></div></div>;
}

export function SmartSebaSite() {
  const [dark, setDark] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [trackOpen, setTrackOpen] = useState(false);
  return <div className={`site-shell ${dark ? 'dark' : ''}`}>
    <TopNav dark={dark} setDark={setDark} onTrack={() => setTrackOpen(true)} />
    <NoticeStrip />
    <main><Hero onTrack={() => setTrackOpen(true)} onService={setSelectedService} /><StatsSection /><QuickActions /><ServicesSection onService={setSelectedService} /><TrackingSection onTrack={() => setTrackOpen(true)} /><DownloadsSection /><ProcessSection /></main>
    <Footer />
    {selectedService && <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />}
    {trackOpen && <TrackModal onClose={() => setTrackOpen(false)} />}
  </div>;
}
