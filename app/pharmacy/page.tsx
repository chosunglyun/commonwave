'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PharmacyPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pharmacies')
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
          우리동네 휴일지킴이 약국
        </h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '3rem', fontSize: '0.9rem' }}>
          일요일 또는 공휴일에도 운영하는 김포시 내 약국 현황입니다. (출처: 경기데이터드림)
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>정보를 불러오는 중입니다...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {data.map((p, i) => (
              <div key={i} style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', color: '#2b84ac', fontWeight: 800 }}>{p.INST_NM}</h3>
                <p style={{ margin: '0 0 1rem', fontSize: '0.95rem', color: '#444', fontWeight: 700 }}>📞 {p.REPRSNT_TELNO}</p>
                
                <div style={{ fontSize: '0.85rem', color: '#333', background: '#f9f9f9', padding: '0.8rem', borderRadius: '4px', marginBottom: '1rem', wordBreak: 'keep-all', lineHeight: 1.4 }}>
                  <span style={{ color: '#2b84ac', fontWeight: 800, marginRight: '4px' }}>📍</span> 
                  {p.REFINE_ROADNM_ADDR}
                  {p.REFINE_LOTNO_ADDR && <div style={{ color: '#888', fontSize: '0.75rem', marginTop: '0.2rem' }}>({p.REFINE_LOTNO_ADDR})</div>}
                </div>
                
                <div style={{ fontSize: '0.85rem', color: '#e11d48', fontWeight: 600, background: '#fff0f2', padding: '0.8rem', borderRadius: '4px' }}>
                  <div style={{ marginBottom: '0.3rem' }}>
                    일요일 진료시간: {p.SUN_BEGIN_TREAT_TM ? `${p.SUN_BEGIN_TREAT_TM} ~ ${p.SUN_END_TREAT_TM}` : '휴무'}
                  </div>
                  <div>
                    공휴일 진료시간: {p.HOLIDAY_BEGIN_TREAT_TM ? `${p.HOLIDAY_BEGIN_TREAT_TM} ~ ${p.HOLIDAY_END_TREAT_TM}` : '휴무'}
                  </div>
                </div>
              </div>
            ))}
            {data.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#888' }}>
                휴일지킴이 약국 정보가 없습니다.
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
