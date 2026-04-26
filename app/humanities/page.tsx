import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function HumanitiesPage() {
  return (
    <div style={{ background: '#F9F8F6', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#2C2B29', fontFamily: '"Nanum Myeongjo", "Batang", serif' }}>
      <Header />
      <main className="container" style={{ flex: 1, padding: '5rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '4rem', borderBottom: '1px solid #D6D1C4', paddingBottom: '2rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.5px', color: '#2C2B29' }}>
            인문학적 시선
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#6B6862', letterSpacing: '0.5px', lineHeight: 1.8 }}>
            데이터 너머의 사람, 사건 이면의 맥락을 짚어보는<br />
            깊이 있는 사유의 공간입니다.
          </p>
        </header>
        
        <div style={{ display: 'grid', gap: '2rem' }}>
          <Link href="/humanities/cinema-archive" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ background: '#fff', padding: '3rem', borderRadius: '4px', border: '1px solid #E5E0D8', transition: 'transform 0.3s, boxShadow 0.3s', cursor: 'pointer' }}
                 onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.05)' }}
                 onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '1rem', color: '#2C2B29' }}>시네마 아카이브</h2>
              <p style={{ fontSize: '1.1rem', color: '#6B6862', lineHeight: 1.8 }}>
                영화라는 렌즈를 통해 우리 시대의 풍경과 인간의 심연을 비평합니다.
                영상이 남긴 파편들을 모아 인문학적 의미를 재구성하는 연재 코너입니다.
              </p>
            </div>
          </Link>
          
          <div style={{ background: '#F4F2EE', padding: '3rem', borderRadius: '4px', border: '1px dashed #D6D1C4', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#8A867D' }}>새로운 시선, 준비 중</h2>
            <p style={{ fontSize: '1rem', color: '#A39F98' }}>
              더 다양한 인문학적 기획이 곧 찾아옵니다.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
