'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Lock, FileText, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function MembershipPage() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (profile) setUserProfile(profile);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // 조합원(member) 이상 권한 체크
  const isAuthorized = userProfile && ['member', 'reporter', 'editor', 'admin'].includes(userProfile.role);

  if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>데이터 불러오는 중...</div>;

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main className="container" style={{ flex: 1, padding: '4rem 1rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2rem', color: 'var(--primary)', textAlign: 'center' }}>
          웨이브 멤버십
        </h1>
        
        {!isAuthorized ? (
          /* 로그인 게이트 (권한이 없는 경우) */
          <section style={{ background: 'var(--primary)', color: '#fff', padding: '3rem', borderRadius: '16px', textAlign: 'center', marginBottom: '4rem' }}>
            <Lock size={48} color="var(--accent)" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem' }}>조합원 전용 라운지</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
              COMMON WAVE의 진정한 주인이 되어 모든 프리미엄 콘텐츠와 권리를 누리세요.
              <br />
              <span style={{ fontSize: '0.9rem', color: 'var(--accent)' }}>
                (일반회원 및 구독자 등급은 접근이 제한됩니다)
              </span>
            </p>
            <Link href="/login" style={{ background: 'var(--accent)', color: 'var(--primary-dark)', padding: '1rem 3rem', borderRadius: '50px', fontWeight: 800, textDecoration: 'none', display: 'inline-block', fontSize: '1.1rem' }}>
              로그인 / 가입하기
            </Link>
          </section>
        ) : (
          /* 실제 멤버십 콘텐츠 (권한이 있는 경우) */
          <>
            {/* 투명성 리포트 */}
            <section style={{ marginBottom: '4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--primary)', paddingBottom: '0.5rem' }}>
                <FileText size={24} color="var(--primary)" />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>투명성 리포트 (2026. 03)</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>수입 현황</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>조합원 회비</span> <strong style={{ color: 'var(--primary)' }}>₩ 12,450,000</strong></li>
                    <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>후원금</span> <strong>₩ 3,200,000</strong></li>
                    <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>기타 사업 수익</span> <strong>₩ 1,150,000</strong></li>
                    <li style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '0.8rem', marginTop: '0.5rem' }}><span>총 수입</span> <strong style={{ fontSize: '1.2rem' }}>₩ 16,800,000</strong></li>
                  </ul>
                </div>
                <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>지출 현황</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>콘텐츠 제작비</span> <strong style={{ color: '#ef4444' }}>₩ 8,500,000</strong></li>
                    <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>운영/서버비</span> <strong style={{ color: '#ef4444' }}>₩ 2,100,000</strong></li>
                    <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>인건비</span> <strong style={{ color: '#ef4444' }}>₩ 4,500,000</strong></li>
                    <li style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '0.8rem', marginTop: '0.5rem' }}><span>총 지출</span> <strong style={{ fontSize: '1.2rem', color: '#ef4444' }}>₩ 15,100,000</strong></li>
                  </ul>
                </div>
              </div>
            </section>
          </>
        )}

        {/* 구독 플랜 3종 (공통 노출) */}
        <section>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, textAlign: 'center', marginBottom: '3rem', color: 'var(--primary)' }}>구독 플랜</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            
            {/* 플랜 1 */}
            <div style={{ background: '#fff', padding: '2.5rem 2rem', borderRadius: '16px', border: '1px solid #e2e8f0', position: 'relative' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>웨이브 서포터</h3>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '1.5rem' }}>월 10,000원</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={18} color="var(--primary)" /> 모든 기사 열람</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={18} color="var(--primary)" /> 액션 스퀘어 투표권</li>
              </ul>
              <Link href="/subscribe" style={{ display: 'block', textAlign: 'center', width: '100%', background: 'var(--primary-light)', color: 'var(--primary)', padding: '1rem', borderRadius: '8px', fontWeight: 800, textDecoration: 'none' }}>선택하기</Link>
            </div>

            {/* 플랜 2 */}
            <div style={{ background: 'var(--primary)', color: '#fff', padding: '2.5rem 2rem', borderRadius: '16px', position: 'relative', transform: 'scale(1.05)', zIndex: 10, boxShadow: '0 20px 40px rgba(27,58,107,0.2)' }}>
              <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: 'var(--primary-dark)', padding: '0.3rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800 }}>RECOMMENDED</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>웨이브 메이커</h3>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent)', marginBottom: '1.5rem' }}>연 100,000원</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={18} color="var(--accent)" /> 모든 기사 열람</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={18} color="var(--accent)" /> 액션 스퀘어 투표권</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={18} color="var(--accent)" /> 연말 정기 총회 참석권</li>
              </ul>
              <Link href="/subscribe" style={{ display: 'block', textAlign: 'center', width: '100%', background: 'var(--accent)', color: 'var(--primary-dark)', padding: '1rem', borderRadius: '8px', fontWeight: 800, textDecoration: 'none' }}>선택하기</Link>
            </div>

            {/* 플랜 3 */}
            <div style={{ background: '#fff', padding: '2.5rem 2rem', borderRadius: '16px', border: '1px solid #e2e8f0', position: 'relative' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>파운딩 웨이브</h3>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '1.5rem' }}>평생 1,000,000원</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={18} color="var(--primary)" /> 모든 기사 평생 열람</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={18} color="var(--primary)" /> 주요 편집 회의 참관</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={18} color="var(--primary)" /> 창립자 명예의 전당 등재</li>
              </ul>
              <Link href="/subscribe" style={{ display: 'block', textAlign: 'center', width: '100%', background: 'var(--primary)', color: '#fff', padding: '1rem', borderRadius: '8px', fontWeight: 800, textDecoration: 'none' }}>선택하기</Link>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
