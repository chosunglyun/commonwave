'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import emailjs from '@emailjs/browser';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_CONFIG } from '@/constants/siteConfig';
import { CheckCircle, Crown, Star, Heart } from 'lucide-react';

// Constants
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';

export default function SubscribePage() {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState('연간 구독');
  const [currentAmount, setCurrentAmount] = useState('100,000원/년');
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    subName: '',
    subPhone: '',
    subEmail: '',
    subAddr: '',
    subNote: '',
    subRecommender: '',
    subUnits: 1,
    agreeCheck: false,
  });

  const selectPlan = (plan: string, amount: string) => {
    setCurrentPlan(plan);
    setCurrentAmount(amount);
    // Scroll to form after selection
    const formElement = document.getElementById('subscription-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target as any;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [id]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const sendSubscription = async () => {
    const { subName, subPhone, subEmail, subAddr, agreeCheck } = formData;

    if (!subName || !subPhone || !subEmail || !subAddr) {
      alert('필수 항목(이름, 연락처, 이메일, 주소)을 모두 입력해 주세요.');
      return;
    }
    if (!agreeCheck) {
      alert('개인정보 수집·이용에 동의해 주세요.');
      return;
    }

    setIsLoading(true);

    try {
      if (EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY') {
        const now = new Date();
        const submittedAt = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;
        const basePrice = parseInt(currentAmount.replace(/[^0-9]/g, '')) || 0;
        const totalPrice = (basePrice * formData.subUnits).toLocaleString() + '원';

        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          plan: currentPlan,
          units: formData.subUnits + '구좌',
          amount: totalPrice,
          name: subName,
          phone: subPhone,
          email: subEmail,
          address: subAddr,
          note: formData.subNote || '(없음)',
          recommender: formData.subRecommender || '(없음)',
          submitted_at: submittedAt
        }, EMAILJS_PUBLIC_KEY);
      }

      alert('구독 신청이 완료되었습니다! 입금 확인 후 안내 드리겠습니다. 감사합니다 🙏');
      router.push('/');
    } catch (err: any) {
      alert('전송 실패: ' + (err.text || '연결 오류'));
    } finally {
      setIsLoading(false);
    }
  };

  const isLifetime = currentPlan === '평생 구독';

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <main className="container" style={{ flex: 1, padding: '4rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '1rem' }}>구독 플랜</h1>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>{SITE_CONFIG.brand.name}와 함께 진실의 파도를 만들어가세요.</p>
        </div>

        {/* 플랜 카드 그리드 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '6rem' }}>
          
          {/* 플랜 1: 월간 */}
          <div 
            onClick={() => selectPlan('월간 구독', '10,000원/월')}
            style={{ 
              background: '#fff', padding: '3rem 2rem', borderRadius: '24px', border: currentPlan === '월간 구독' ? '3px solid var(--primary)' : '1px solid #e2e8f0', 
              position: 'relative', cursor: 'pointer', transition: 'all 0.3s',
              transform: currentPlan === '월간 구독' ? 'scale(1.02)' : 'none',
              boxShadow: currentPlan === '월간 구독' ? '0 10px 30px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <Heart size={32} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>웨이브 서포터</h3>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '2rem' }}>월 10,000원</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><CheckCircle size={20} color="var(--primary)" /> 모든 기사 실시간 열람</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><CheckCircle size={20} color="var(--primary)" /> 액션 스퀘어 투표권 부여</li>
            </ul>
            <button style={{ 
              width: '100%', background: currentPlan === '월간 구독' ? 'var(--primary)' : '#f1f5f9', 
              color: currentPlan === '월간 구독' ? '#fff' : '#64748b', 
              padding: '1.2rem', borderRadius: '12px', fontWeight: 800, border: 'none', fontSize: '1.1rem' 
            }}>
              {currentPlan === '월간 구독' ? '선택됨 ✓' : '선택하기'}
            </button>
          </div>

          {/* 플랜 2: 연간 (추천) */}
          <div 
            onClick={() => selectPlan('연간 구독', '100,000원/년')}
            style={{ 
              background: 'var(--primary)', color: '#fff', padding: '3.5rem 2rem', borderRadius: '24px', 
              position: 'relative', cursor: 'pointer', transition: 'all 0.3s',
              transform: currentPlan === '연간 구독' ? 'scale(1.08)' : 'scale(1.05)',
              zIndex: 10, boxShadow: '0 25px 50px rgba(27,58,107,0.25)',
              border: currentPlan === '연간 구독' ? '4px solid var(--accent)' : 'none'
            }}
          >
            <div style={{ position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: 'var(--primary-dark)', padding: '0.5rem 1.5rem', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 900, letterSpacing: '1px' }}>RECOMMENDED</div>
            <Star size={36} color="var(--accent)" fill="var(--accent)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>웨이브 메이커</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent)', marginBottom: '2rem' }}>연 100,000원</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><CheckCircle size={22} color="var(--accent)" /> 모든 기사 실시간 열람</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><CheckCircle size={22} color="var(--accent)" /> 액션 스퀘어 투표권 부여</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><CheckCircle size={22} color="var(--accent)" /> 연말 정기 총회 참석권</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><CheckCircle size={22} color="var(--accent)" /> 2개월분 구독료 절감 혜택</li>
            </ul>
            <button style={{ 
              width: '100%', background: 'var(--accent)', color: 'var(--primary-dark)', 
              padding: '1.2rem', borderRadius: '12px', fontWeight: 900, border: 'none', fontSize: '1.1rem' 
            }}>
              {currentPlan === '연간 구독' ? '선택됨 ✓' : '선택하기'}
            </button>
          </div>

          {/* 플랜 3: 평생 */}
          <div 
            onClick={() => selectPlan('평생 구독', '1,000,000원 (일시납)')}
            style={{ 
              background: '#fff', padding: '3rem 2rem', borderRadius: '24px', border: currentPlan === '평생 구독' ? '3px solid var(--primary)' : '1px solid #e2e8f0', 
              position: 'relative', cursor: 'pointer', transition: 'all 0.3s',
              transform: currentPlan === '평생 구독' ? 'scale(1.02)' : 'none',
              boxShadow: currentPlan === '평생 구독' ? '0 10px 30px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <Crown size={32} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>파운딩 웨이브</h3>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '2rem' }}>평생 1,000,000원</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><CheckCircle size={20} color="var(--primary)" /> 모든 기사 평생 무제한 열람</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><CheckCircle size={20} color="var(--primary)" /> 주요 편집 회의 참관 및 발언권</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><CheckCircle size={20} color="var(--primary)" /> 창립자 명예의 전당 지면 등재</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><CheckCircle size={20} color="var(--primary)" /> 특별 굿즈 패키지 발송</li>
            </ul>
            <button style={{ 
              width: '100%', background: currentPlan === '평생 구독' ? 'var(--primary)' : '#f1f5f9', 
              color: currentPlan === '평생 구독' ? '#fff' : '#64748b', 
              padding: '1.2rem', borderRadius: '12px', fontWeight: 800, border: 'none', fontSize: '1.1rem' 
            }}>
              {currentPlan === '평생 구독' ? '선택됨 ✓' : '선택하기'}
            </button>
          </div>
        </div>

        {/* 신청서 폼 */}
        <div id="subscription-form" style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', padding: '3rem', borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center' }}>구독 신청서</h2>
          
          <div style={{ background: isLifetime ? 'var(--gold-l)' : 'var(--primary-light)', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>선택한 플랜</span>
            <span style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '1.2rem' }}>{currentPlan}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.9rem' }}>이름 (실명) *</label>
              <input type="text" id="subName" value={formData.subName} onChange={handleInputChange} placeholder="홍길동" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #ddd', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.9rem' }}>연락처 *</label>
              <input type="tel" id="subPhone" value={formData.subPhone} onChange={handleInputChange} placeholder="010-0000-0000" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #ddd', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.9rem' }}>이메일 *</label>
              <input type="email" id="subEmail" value={formData.subEmail} onChange={handleInputChange} placeholder="example@email.com" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #ddd', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.9rem' }}>배송 주소 *</label>
              <input type="text" id="subAddr" value={formData.subAddr} onChange={handleInputChange} placeholder="경기도 김포시 00동..." style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #ddd', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.9rem' }}>추천인 (있는 경우)</label>
              <input type="text" id="subRecommender" value={formData.subRecommender} onChange={handleInputChange} placeholder="추천해주신 분의 성함" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #ddd', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.9rem' }}>남기실 말씀</label>
              <textarea id="subNote" value={formData.subNote} onChange={handleInputChange} placeholder="기타 요청사항이 있으시면 적어주세요." style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #ddd', outline: 'none', minHeight: '100px' }}></textarea>
            </div>

            <div style={{ background: '#fff9e6', padding: '1.5rem', borderRadius: '16px', border: '1px solid #ffeeba', fontSize: '0.9rem', lineHeight: '1.6' }}>
              <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#856404' }}>📢 입금 계좌 안내</strong>
              농협 000-0000-0000-00 (예금주: {SITE_CONFIG.brand.name_kr})<br />
              입금 확인 후 구독 혜택 안내 및 배송을 시작합니다.
            </div>

            <label style={{ display: 'flex', gap: '0.8rem', cursor: 'pointer', fontSize: '0.9rem', color: '#666', alignItems: 'center' }}>
              <input type="checkbox" id="agreeCheck" checked={formData.agreeCheck} onChange={handleInputChange} style={{ width: '18px', height: '18px' }} />
              개인정보 수집 및 이용에 동의합니다.
            </label>

            <button 
              onClick={sendSubscription}
              disabled={isLoading}
              style={{ 
                width: '100%', background: 'var(--primary)', color: '#fff', padding: '1.2rem', 
                borderRadius: '16px', fontWeight: 900, border: 'none', fontSize: '1.2rem', 
                cursor: 'pointer', transition: 'all 0.2s',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? '신청 중...' : '구독 신청 완료하기'}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
