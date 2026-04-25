import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

export default function ActionSquarePage() {
  const proposals = [
    {
      id: 1,
      title: '강진읍 주차장 부족 문제 해결 방안',
      content: '시내 중심가 주차 공간이 턱없이 부족합니다. 옛 터미널 부지를 활용해 공영 주차장을 신설하는 것을 제안합니다.',
      votes_for: 142,
      votes_against: 38,
      status: '진행중',
      created_at: '2026-04-20',
      user: '김시민'
    },
    {
      id: 2,
      title: '청년 농업인 정착 지원금 확대',
      content: '초기 정착에 어려움을 겪는 청년 농업인들을 위해 첫 3년간 지원금을 현행보다 50% 확대해야 합니다.',
      votes_for: 310,
      votes_against: 15,
      status: '통과',
      created_at: '2026-03-15',
      user: '이청년'
    }
  ];

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main className="container" style={{ flex: 1, padding: '4rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)', margin: 0 }}>
            액션 스퀘어
          </h1>
          <button style={{ background: 'var(--primary)', color: '#fff', padding: '0.8rem 1.5rem', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            새 제안 작성하기
          </button>
        </div>
        
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {proposals.map(p => (
            <div key={p.id} style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', background: p.status === '진행중' ? 'var(--accent)' : '#e2e8f0', color: p.status === '진행중' ? 'var(--primary)' : '#64748b', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 800, marginBottom: '0.5rem', display: 'inline-block' }}>
                    {p.status}
                  </span>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem' }}>{p.title}</h2>
                  <div style={{ fontSize: '0.9rem', color: '#64748b', display: 'flex', gap: '1rem' }}>
                    <span>제안자: {p.user}</span>
                    <span>{p.created_at}</span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: '#334155' }}>
                {p.content}
              </p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '0.8rem 1.5rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', flex: 1, justifyContent: 'center' }}>
                  <ThumbsUp size={20} /> 찬성 ({p.votes_for})
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '0.8rem 1.5rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', flex: 1, justifyContent: 'center' }}>
                  <ThumbsDown size={20} /> 반대 ({p.votes_against})
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
