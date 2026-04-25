import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function GlassWatchPage() {
  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main className="container" style={{ flex: 1, padding: '4rem 1rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2rem', color: 'var(--primary)' }}>
          유리알 워치
        </h1>
        <div style={{ background: '#fff', padding: '3rem', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center' }}>
          <p style={{ fontSize: '1.2rem', color: '#64748b' }}>이 페이지는 준비 중입니다.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
