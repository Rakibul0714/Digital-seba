'use client';

import { Landmark } from 'lucide-react';

export interface CertificateData {
  trackingNo: string;
  certificateNo: string;
  serviceName: string;
  applicant: {
    fullName: string;
    fatherName?: string;
    motherName?: string;
    mobile?: string;
    address?: string;
    ward?: string;
    holdingNo?: string;
    union?: string;
    nationality?: string;
    dateOfBirth?: string;
    photo?: string;
  };
  union: string;
  status: string;
  issueDate: string | Date;
  createdAt: string | Date;
}

function formatDate(d: string | Date): string {
  const date = new Date(d);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function Certificate({ data }: { data: CertificateData }) {
  return (
    <div id="certificate" style={{
      width: '297mm',
      height: '210mm',
      margin: '0 auto',
      background: '#fff',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '"Times New Roman", "Noto Sans Bengali", serif',
      color: '#1a1a1a',
      boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
    }}>
      {/* Outer decorative border */}
      <div style={{
        position: 'absolute',
        inset: '8px',
        border: '3px solid #1a3a5c',
        borderRadius: '4px',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        inset: '14px',
        border: '1px solid #2a5a8c',
        borderRadius: '2px',
        pointerEvents: 'none',
      }} />

      {/* Corner ornaments */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos) => (
        <div key={pos} style={{
          position: 'absolute',
          [pos.includes('top') ? 'top' : 'bottom']: '18px',
          [pos.includes('left') ? 'left' : 'right']: '18px',
          width: '45px',
          height: '45px',
          borderTop: pos.includes('top') ? '2px solid #1a3a5c' : 'none',
          borderBottom: pos.includes('bottom') ? '2px solid #1a3a5c' : 'none',
          borderLeft: pos.includes('left') ? '2px solid #1a3a5c' : 'none',
          borderRight: pos.includes('right') ? '2px solid #1a3a5c' : 'none',
        }} />
      ))}

      {/* Content */}
      <div style={{ position: 'relative', padding: '35px 55px', height: '100%', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '6px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0a7255, #064a37)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 2px 8px rgba(0,106,78,0.3)',
            }}>
              <Landmark size={28} strokeWidth={2} />
            </div>
          </div>
          <div style={{
            fontSize: '11px',
            fontWeight: '700',
            color: '#1a3a5c',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: '2px',
          }}>
            Government of the People&apos;s Republic of Bangladesh
          </div>
          <div style={{
            fontSize: '10px',
            color: '#555',
            letterSpacing: '1px',
          }}>
            Union Parishad Digital Service Platform
          </div>
        </div>

        {/* Certificate Number */}
        <div style={{
          position: 'absolute',
          top: '35px',
          right: '55px',
          fontSize: '12px',
          color: '#1a3a5c',
          fontWeight: '700',
        }}>
          No. <span style={{ color: '#c41e3a', fontSize: '14px' }}>{data.certificateNo}</span>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', margin: '10px 0 18px' }}>
          <h1 style={{
            fontSize: '26px',
            fontWeight: '900',
            color: '#1a3a5c',
            margin: 0,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            lineHeight: '1.3',
          }}>
            Citizen Certificate
          </h1>
          <div style={{
            width: '200px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #1a3a5c, transparent)',
            margin: '8px auto 0',
          }} />
        </div>

        {/* Body */}
        <div style={{ display: 'flex', gap: '35px', flex: 1 }}>
          {/* Left - Info */}
          <div style={{ flex: 1, fontSize: '13.5px', lineHeight: '2.1' }}>
            <div style={{ marginBottom: '4px' }}>
              <strong style={{ color: '#1a3a5c', display: 'inline-block', width: '165px' }}>Full Name:</strong>
              <span style={{ fontWeight: '600' }}>{data.applicant.fullName || '---'}</span>
            </div>
            <div style={{ marginBottom: '4px' }}>
              <strong style={{ color: '#1a3a5c', display: 'inline-block', width: '165px' }}>Father/Husband Name:</strong>
              <span>{data.applicant.fatherName || '---'}</span>
            </div>
            <div style={{ marginBottom: '4px' }}>
              <strong style={{ color: '#1a3a5c', display: 'inline-block', width: '165px' }}>Mother Name:</strong>
              <span>{data.applicant.motherName || '---'}</span>
            </div>
            <div style={{ marginBottom: '4px' }}>
              <strong style={{ color: '#1a3a5c', display: 'inline-block', width: '165px' }}>Date of Birth:</strong>
              <span>{data.applicant.dateOfBirth || '---'}</span>
            </div>
            <div style={{ marginBottom: '4px' }}>
              <strong style={{ color: '#1a3a5c', display: 'inline-block', width: '165px' }}>Nationality:</strong>
              <span>{data.applicant.nationality || 'Bangladeshi'}</span>
            </div>
            <div style={{ marginBottom: '4px' }}>
              <strong style={{ color: '#1a3a5c', display: 'inline-block', width: '165px' }}>Address:</strong>
              <span>{data.applicant.address || '---'}</span>
            </div>
            <div style={{ marginBottom: '4px' }}>
              <strong style={{ color: '#1a3a5c', display: 'inline-block', width: '165px' }}>Union:</strong>
              <span>{data.union || '---'}</span>
            </div>
            <div style={{ marginBottom: '4px' }}>
              <strong style={{ color: '#1a3a5c', display: 'inline-block', width: '165px' }}>Ward:</strong>
              <span>{data.applicant.ward || '---'}</span>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <strong style={{ color: '#1a3a5c', display: 'inline-block', width: '165px' }}>Holding No:</strong>
              <span>{data.applicant.holdingNo || '---'}</span>
            </div>

            {/* Declaration */}
            <div style={{
              background: '#f5f8f6',
              border: '1px solid #d4e5da',
              borderRadius: '6px',
              padding: '10px 14px',
              fontSize: '11.5px',
              lineHeight: '1.7',
              color: '#333',
            }}>
              This is to certify that the above-named person is a bonafide citizen of this Union Parishad area and all information provided herein has been verified and found to be correct to the best of our knowledge.
            </div>
          </div>

          {/* Right - Photo + Signature */}
          <div style={{ width: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            {/* Photo box */}
            <div style={{
              width: '140px',
              height: '170px',
              border: '2px solid #1a3a5c',
              borderRadius: '4px',
              overflow: 'hidden',
              background: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {data.applicant.photo ? (
                <img src={data.applicant.photo} alt={data.applicant.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center', color: '#999', fontSize: '11px' }}>
                  <div style={{ fontSize: '32px', marginBottom: '4px' }}>📷</div>
                  Photo
                </div>
              )}
            </div>
            <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: '700', color: '#1a3a5c' }}>
              {data.applicant.fullName}
            </div>

            {/* Signature areas */}
            <div style={{ marginTop: 'auto', width: '100%' }}>
              <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                <div style={{
                  borderBottom: '1px solid #333',
                  width: '130px',
                  margin: '0 auto 4px',
                  paddingBottom: '2px',
                  fontStyle: 'italic',
                  fontSize: '16px',
                  color: '#1a3a5c',
                  fontFamily: 'cursive',
                }}>
                  {data.applicant.fullName?.split(' ').slice(0, 2).join(' ')}
                </div>
                <div style={{ fontSize: '10px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Signature of Holder
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  borderBottom: '1px solid #333',
                  width: '130px',
                  margin: '0 auto 4px',
                  paddingBottom: '2px',
                  fontStyle: 'italic',
                  fontSize: '16px',
                  color: '#1a3a5c',
                  fontFamily: 'cursive',
                }}>
                  Chairman
                </div>
                <div style={{ fontSize: '10px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Chairman, {data.union}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '10px',
          paddingTop: '8px',
          borderTop: '1px solid #ddd',
          fontSize: '10px',
          color: '#777',
        }}>
          <span>Issued: {formatDate(data.issueDate)}</span>
          <span>Tracking: {data.trackingNo}</span>
          <span style={{ fontStyle: 'italic' }}>Digital Seba Platform</span>
        </div>
      </div>
    </div>
  );
}
