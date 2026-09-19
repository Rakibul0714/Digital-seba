'use client';

import { FormEvent, useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, Download, Landmark, Loader2, Search, CheckCircle2 } from 'lucide-react';
import Certificate, { CertificateData } from '@/components/Certificate';

export default function CertificateDownloadPage() {
  const [trackingNo, setTrackingNo] = useState('');
  const [data, setData] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!trackingNo.trim()) return;
    setLoading(true);
    setError('');
    setData(null);
    try {
      const response = await fetch(`/api/v1/certificates/${encodeURIComponent(trackingNo.trim())}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Certificate not found');
      if (result.error === 'NOT_APPROVED') {
        setError(`Application not yet approved. Current status: ${result.status}. Please wait for admin approval.`);
        return;
      }
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Certificate not found');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const el = certRef.current;
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: el.scrollWidth,
        height: el.scrollHeight,
        windowWidth: el.scrollWidth,
        windowHeight: el.scrollHeight,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height);
      const w = canvas.width * ratio;
      const h = canvas.height * ratio;
      pdf.addImage(imgData, 'PNG', (pdfWidth - w) / 2, (pdfHeight - h) / 2, w, h);
      pdf.save(`Certificate-${data?.certificateNo || trackingNo}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: '#fafaf7' }}>
      <header style={{ height: '72px', background: 'rgba(250,250,247,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #dcebe1', display: 'flex', alignItems: 'center', padding: '0 clamp(20px, 5vw, 60px)' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#1a3a2c' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: 'linear-gradient(145deg, #087f5b, #004c39)', display: 'grid', placeItems: 'center', color: '#fff' }}>
            <Landmark size={20} />
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '17px', color: '#0a6048' }}>Digital Seba</div>
            <div style={{ fontSize: '9px', color: '#80928b' }}>Digital Union Parishad</div>
          </div>
        </a>
      </header>

      <div style={{ background: 'linear-gradient(135deg, #064a37, #006a4e)', padding: '36px clamp(20px, 5vw, 60px)', color: '#fff' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#96c3a9', fontSize: '12px', textDecoration: 'none', marginBottom: '14px' }}>
            <ArrowLeft size={14} /> Homepage
          </a>
          <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 6px' }}>Certificate Download</h1>
          <p style={{ color: '#a9d5bb', fontSize: '14px', margin: 0 }}>Search your certificate by tracking number and download as PDF.</p>
        </div>
      </div>

      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '40px clamp(20px, 5vw, 60px)' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', maxWidth: '600px', margin: '0 auto 40px' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', border: '2px solid #d4e5da', borderRadius: '12px', padding: '12px 16px', background: '#fff' }}>
            <Search size={18} color="#7f9e8e" />
            <input type="text" value={trackingNo} onChange={(e) => setTrackingNo(e.target.value)} placeholder="Enter tracking number" style={{ border: '0', outline: '0', background: '0', width: '100%', fontSize: '14px', color: '#1f302c' }} />
          </div>
          <button type="submit" disabled={loading || !trackingNo.trim()} style={{ padding: '12px 24px', background: '#0a7255', color: '#fff', border: '0', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading || !trackingNo.trim() ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            Search
          </button>
        </form>

        {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '16px', color: '#dc2626', fontSize: '14px', textAlign: 'center', maxWidth: '600px', margin: '0 auto 30px' }}>{error}</div>}

        {data && (
          <div>
            <div style={{ background: '#eff8f0', border: '1px solid #c7e3ce', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={20} color="#087152" />
                <div>
                  <div style={{ fontWeight: '700', color: '#17654e', fontSize: '14px' }}>Certificate Found</div>
                  <div style={{ color: '#769187', fontSize: '12px' }}>Certificate No: {data.certificateNo} - {data.serviceName}</div>
                </div>
              </div>
              <button onClick={handleDownloadPDF} disabled={downloading} style={{ padding: '10px 20px', background: '#0a7255', color: '#fff', border: '0', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: downloading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: downloading ? 0.6 : 1 }}>
                {downloading ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
                Download PDF
              </button>
            </div>

            <div style={{ overflow: 'visible', width: '100%' }}>
              <div ref={certRef} style={{ width: '297mm', transformOrigin: 'top left', transform: 'scale(0.55)', marginBottom: '-95mm' }}>
                <Certificate data={data} />
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <button onClick={handleDownloadPDF} disabled={downloading} style={{ padding: '14px 36px', background: '#0a7255', color: '#fff', border: '0', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: downloading ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px', opacity: downloading ? 0.6 : 1 }}>
                {downloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                {downloading ? 'Generating PDF...' : 'Download Certificate PDF'}
                {!downloading && <ArrowRight size={16} />}
              </button>
            </div>
          </div>
        )}

        {!data && !error && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
            <Search size={48} color="#ccc" style={{ marginBottom: '16px' }} />
            <h3 style={{ color: '#555', margin: '0 0 8px' }}>Search Your Certificate</h3>
            <p style={{ fontSize: '14px', margin: 0 }}>Enter your tracking number above to view and download your certificate.</p>
          </div>
        )}
      </div>
    </main>
  );
}
