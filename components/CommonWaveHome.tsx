'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Users, TrendingUp, Activity, AlertCircle } from 'lucide-react';

export function CommonWaveHome({ articles, farmPrices, memberCount }: { articles: any[]; farmPrices: any[]; memberCount: number }) {
  const topArticles = articles.slice(0, 3);
  const peopleLog = articles.filter(a => a.category === '피플 로그').slice(0, 3);
  const commonPick = articles.filter(a => a.category === '커먼 픽').slice(0, 4);
  
  // 미세먼지, 교통혼잡도 모의 데이터 (실제 연동 전)
  const airQuality = '좋음 (32µg/m³)';
  const traffic = '원활';

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh', paddingBottom: '4rem' }}>
      
      {/* 1. 상단 히어로 */}
      <section style={{ 
        background: 'var(--primary)', 
        color: '#fff', 
        padding: '5rem 1rem 8rem 1rem', 
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>

          
          <div style={{ 
            fontSize: '1.1rem', 
            lineHeight: '1.8', 
            opacity: 0.9, 
            maxWidth: '700px', 
            margin: '0 auto',
            wordBreak: 'keep-all'
          }}>
            <p style={{ marginBottom: '1rem' }}>
              작은 움직임 하나가 수면 위로 번지고, 마침내 해안을 바꾼다.<br />
              커먼 웨이브는 그 파도를 시민의 손으로 만들기 위해 시작되었다.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              광고주도, 권력도 아닌 — 우리의 유일한 주주는 시민이다.<br />
              데이터로 진실을 드러내고, 이웃의 삶을 기록한다.
            </p>
            <p style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--accent)', marginTop: '1.5rem' }}>
              우리는 파도다. 함께하라.
            </p>
          </div>
          

        </div>
        
        {/* Background Wave Graphic */}
        <div style={{ position: 'absolute', bottom: '-50px', left: 0, width: '100%', height: '150px', background: 'var(--background)', borderRadius: '50% 50% 0 0', transform: 'scaleX(1.5)' }} />
      </section>

      <div className="container" style={{ marginTop: '-3rem', position: 'relative', zIndex: 10 }}>
        {/* 2. L-Dashboard 섹션 */}
        <section style={{ 
          background: '#fff', 
          borderRadius: '16px', 
          padding: '2rem', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          marginBottom: '4rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
            <Activity size={24} /> 웨이브 인덱스 (L-Dashboard)
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {/* 장바구니 물가 */}
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#334155' }}>장바구니 물가 (KAMIS)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {farmPrices.slice(0, 3).map((p, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{p.item_name} <small>({p.unit})</small></span>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{parseInt(p.price).toLocaleString()}원</span>
                  </div>
                ))}
              </div>
              <Link href="/wave-index" style={{ display: 'block', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--primary)', textAlign: 'right', fontWeight: 600 }}>자세히 보기 →</Link>
            </div>

            {/* 환경 & 교통 */}
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#334155' }}>실시간 지역 지표</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.9rem', color: '#64748b' }}>미세먼지</span>
                  <span style={{ fontWeight: 700, color: '#10b981' }}>{airQuality}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#64748b' }}>주요 도로 소통</span>
                  <span style={{ fontWeight: 700, color: '#3b82f6' }}>{traffic}</span>
                </div>
              </div>
            </div>

            {/* 유리알 워치 미니 위젯 */}
            <div style={{ background: 'var(--primary)', padding: '1.5rem', borderRadius: '12px', color: '#fff' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--accent)' }}>유리알 워치</h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '1.5rem', lineHeight: 1.5 }}>
                2026년도 상반기 지자체 예산 집행 현황을 투명하게 추적합니다.
              </p>
              <div style={{ width: '100%', background: 'rgba(255,255,255,0.2)', height: '8px', borderRadius: '4px', marginBottom: '0.5rem' }}>
                <div style={{ width: '42%', background: 'var(--accent)', height: '100%', borderRadius: '4px' }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.8 }}>
                <span>집행률: 42%</span>
                <span>목표: 50%</span>
              </div>
              <Link href="/glass-watch" style={{ display: 'block', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--accent)', textAlign: 'right', fontWeight: 600 }}>상세 리포트 보기 →</Link>
            </div>
          </div>
        </section>

        {/* 3. 콘텐츠 섹션 */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
          
          {/* 오늘의 웨이브 */}
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '1.5rem', color: 'var(--primary)', borderBottom: '3px solid var(--primary)', paddingBottom: '0.5rem' }}>
              오늘의 웨이브
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {topArticles.map((art, i) => (
                <Link key={art.id} href={`/article/${art.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', gap: '1.5rem', background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', transition: 'transform 0.2s', border: '1px solid #e2e8f0' }}>
                  {art.image_url && (
                    <div style={{ width: '200px', height: '140px', position: 'relative', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                      <Image src={art.image_url} alt={art.title} fill style={{ objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem', background: 'var(--primary-light)', padding: '0.2rem 0.6rem', borderRadius: '4px', alignSelf: 'flex-start' }}>{art.category || '종합'}</span>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.4 }}>{art.title}</h3>
                    <p style={{ fontSize: '0.95rem', color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {art.content?.replace(/<[^>]*>/g, '').substring(0, 100)}...
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 사이드바 - 피플 로그 & 액션 스퀘어 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* 조합원 가입 미니 박스 */}
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '2px solid var(--accent)', display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600, marginBottom: '0.2rem' }}>현재 함께하는 조합원</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Users size={26} color="var(--primary)" />
                  {memberCount.toLocaleString()}명
                </div>
              </div>
              <Link href="/membership" style={{ 
                background: 'var(--accent)', 
                color: 'var(--primary-dark)', 
                padding: '0.8rem 1rem', 
                borderRadius: '8px', 
                fontWeight: 800, 
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                width: '100%'
              }}>
                조합원 가입하기 <ArrowRight size={18} />
              </Link>
            </div>
            
            {/* 피플 로그 */}
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary)' }}>피플 로그</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {peopleLog.length > 0 ? peopleLog.map(art => (
                  <Link key={art.id} href={`/article/${art.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {art.image_url && (
                      <div style={{ width: '60px', height: '60px', position: 'relative', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                        <Image src={art.image_url} alt={art.title} fill style={{ objectFit: 'cover' }} />
                      </div>
                    )}
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem' }}>{art.title}</h4>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{new Date(art.created_at).toLocaleDateString()}</span>
                    </div>
                  </Link>
                )) : (
                  <p style={{ fontSize: '0.9rem', color: '#64748b' }}>최신 인물 인터뷰가 없습니다.</p>
                )}
              </div>
              <Link href="/people-log" style={{ display: 'block', marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-light)', padding: '0.5rem', borderRadius: '6px', textDecoration: 'none' }}>더보기</Link>
            </div>

            {/* 액션 스퀘어 HOT */}
            <div style={{ background: 'var(--primary)', padding: '1.5rem', borderRadius: '12px', color: '#fff' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={20} /> 액션 스퀘어 HOT
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.75rem', background: 'var(--accent)', color: 'var(--primary)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 800, marginBottom: '0.5rem', display: 'inline-block' }}>진행중</span>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>강진읍 주차장 부족 문제 해결 방안</h4>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--accent)' }}>찬성 142</span>
                    <span style={{ color: '#ff7675' }}>반대 38</span>
                  </div>
                </div>
              </div>
              <Link href="/action-square" style={{ display: 'block', marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)', background: 'var(--accent)', padding: '0.5rem', borderRadius: '6px', textDecoration: 'none' }}>참여하기</Link>
            </div>

          </div>
        </div>

        {/* 4. 커먼 픽 */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '1.5rem', color: 'var(--primary)', textAlign: 'center' }}>커먼 픽 (이번 주 추천)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {commonPick.length > 0 ? commonPick.map(art => (
              <Link key={art.id} href={`/article/${art.id}`} style={{ textDecoration: 'none', color: 'inherit', background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                {art.image_url ? (
                  <div style={{ width: '100%', height: '160px', position: 'relative' }}>
                    <Image src={art.image_url} alt={art.title} fill style={{ objectFit: 'cover' }} />
                  </div>
                ) : (
                  <div style={{ width: '100%', height: '160px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    COMMON PICK
                  </div>
                )}
                <div style={{ padding: '1.2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.4 }}>{art.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
                    {art.content?.replace(/<[^>]*>/g, '').substring(0, 100)}...
                  </p>
                </div>
              </Link>
            )) : (
              [1, 2, 3, 4].map(i => (
                <div key={i} style={{ background: '#fff', borderRadius: '12px', height: '280px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>추천 콘텐츠 준비중</div>
              ))
            )}
          </div>
        </section>

        {/* 5. 하단 배너 */}
        <section style={{ 
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
          borderRadius: '24px',
          padding: '4rem 2rem',
          textAlign: 'center',
          color: '#fff',
          boxShadow: '0 20px 40px rgba(27,58,107,0.2)'
        }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>당신이 이 언론의 주인입니다</h2>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '2.5rem' }}>
            COMMON WAVE는 자본과 권력으로부터 독립된 시민들의 플랫폼입니다.<br />
            현재 {memberCount.toLocaleString()}명의 시민이 함께 파도를 만들고 있습니다.
          </p>
          <Link href="/membership" style={{ 
            background: 'var(--accent)', 
            color: 'var(--primary-dark)', 
            padding: '1.2rem 3rem', 
            borderRadius: '50px', 
            fontWeight: 800, 
            fontSize: '1.2rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.8rem',
            transition: 'transform 0.2s',
            boxShadow: '0 10px 20px rgba(0,201,177,0.3)'
          }}>
            조합원 가입하기 <ArrowRight size={20} />
          </Link>
        </section>

      </div>
    </div>
  );
}
