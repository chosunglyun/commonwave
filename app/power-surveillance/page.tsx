import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function PowerSurveillancePage() {
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .in('category', ['유리알 워치', '권력 감시'])
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main className="container" style={{ flex: 1, padding: '4rem 1rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2rem', color: 'var(--primary)' }}>
          권력 감시
        </h1>
        <p style={{ color: '#64748b', marginBottom: '3rem', fontSize: '1.1rem' }}>지자체 예산과 정책을 투명하게 들여다보고 시민의 눈으로 감시합니다.</p>

        {articles && articles.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {articles.map((art) => (
              <Link key={art.id} href={`/article/${art.id}`} style={{ textDecoration: 'none', color: 'inherit', background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s' }}>
                {art.image_url ? (
                  <div style={{ width: '100%', height: '180px', position: 'relative' }}>
                    <Image src={art.image_url} alt={art.title} fill style={{ objectFit: 'cover' }} />
                  </div>
                ) : (
                  <div style={{ width: '100%', height: '180px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 800 }}>
                    POWER SURVEILLANCE
                  </div>
                )}
                <div style={{ padding: '1.5rem', flex: 1 }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.8rem', lineHeight: 1.4 }}>{art.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {art.content?.replace(/<[^>]*>/g, '').substring(0, 100)}...
                  </p>
                  <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                    {new Date(art.created_at).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ background: '#fff', padding: '5rem', borderRadius: '16px', textAlign: 'center', color: '#94a3b8', border: '1px solid #e2e8f0' }}>
            아직 등록된 기사가 없습니다. 기사를 작성해 보세요!
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
