'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NursingHospitalsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/nursing-hospitals')
      .then(res => res.json())
      .then(json => {
        if (json.data) {
          setData(json.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <Header />
      <div className="container" style={{ padding: '3rem 0', minHeight: '60vh' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#2b84ac', marginBottom: '0.5rem', textAlign: 'center' }}>
          우리동네 요양병원 현황 (병원급)
        </h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '3rem', fontSize: '0.9rem' }}>
          김포시 내 정상 영업 중인 병원급 요양병원 정보입니다. (출처: 경기데이터드림)
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>정보를 불러오는 중입니다...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {data.map((h, i) => (
              <div key={i} style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#2b84ac', fontWeight: 800 }}>{h.BIZPLC_NM}</h3>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: '#e6f4ea', color: '#137333', borderRadius: '4px', fontWeight: 700 }}>
                    {h.BSN_STATE_NM}
                  </span>
                </div>
                
                <div style={{ fontSize: '0.85rem', color: '#333', background: '#f9f9f9', padding: '0.8rem', borderRadius: '4px', marginBottom: '1rem', wordBreak: 'keep-all', lineHeight: 1.4 }}>
                  <span style={{ color: '#2b84ac', fontWeight: 800, marginRight: '4px' }}>📍</span> 
                  {h.REFINE_ROADNM_ADDR || h.REFINE_LOTNO_ADDR}
                </div>
                
                <div style={{ fontSize: '0.85rem', color: '#555', background: '#f0f7ff', padding: '0.8rem', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span>🛏️ <strong>병상 수:</strong> {h.SICKBD_CNT}개</span>
                    <span>👩‍⚕️ <strong>의료인 수:</strong> {h.MEDSTAF_CNT}명</span>
                  </div>
                  <div style={{ borderTop: '1px dashed #cce3ff', paddingTop: '0.4rem', marginTop: '0.4rem' }}>
                    <strong style={{ color: '#2b84ac' }}>진료과목:</strong> 
                    <div style={{ fontSize: '0.8rem', marginTop: '0.2rem', lineHeight: 1.4 }}>
                      {h.TREAT_SBJECT_CONT || '정보 없음'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {data.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#888' }}>
                요양병원 정보가 없습니다.
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
