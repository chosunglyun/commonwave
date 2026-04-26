import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function CinemaArchivePage() {
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .in('category', ['시네마 아카이브', '인문학적 시선'])
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  return (
    <div style={{ background: '#F9F8F6', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#2C2B29', fontFamily: '"Nanum Myeongjo", "Batang", serif' }}>
      <Header />
      <main className="container" style={{ flex: 1, padding: '5rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ fontSize: '1rem', color: '#8A867D', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem', display: 'block' }}>인문학적 시선</span>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: '-1px' }}>
            시네마 아카이브
          </h1>
          <div style={{ width: '40px', height: '1px', background: '#D6D1C4', margin: '0 auto 1.5rem' }}></div>
          <p style={{ fontSize: '1.2rem', color: '#6B6862', letterSpacing: '0.5px', lineHeight: 1.8, maxWidth: '600px', margin: '0 auto' }}>
            영화로 읽는 시대의 풍경, 영상 언어에 담긴 인문학적 성찰
          </p>
        </div>

        {articles && articles.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '3rem' }}>
            {articles.map((art) => (
              <Link key={art.id} href={`/article/${art.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative', overflow: 'hidden', borderRadius: '4px' }}>
                  {art.image_url ? (
                    <Image src={art.image_url} alt={art.title} fill style={{ objectFit: 'cover', filter: 'grayscale(15%)', transition: 'transform 0.5s' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#EAE6DF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#A39F98', fontStyle: 'italic' }}>Cinema Archive</span>
                    </div>
                  )}
                </div>
                <div>
                  <span style={{ fontSize: '0.9rem', color: '#8A867D', display: 'block', marginBottom: '0.5rem' }}>
                    {new Date(art.created_at).toLocaleDateString()}
                  </span>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.4, color: '#2C2B29' }}>{art.title}</h3>
                  <p style={{ fontSize: '1.1rem', color: '#5C5A55', lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {art.content?.replace(/<[^>]*>/g, '')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ background: '#fff', padding: '5rem', borderRadius: '4px', textAlign: 'center', color: '#8A867D', border: '1px solid #E5E0D8' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>연재된 비평이 없습니다.</p>
            <p style={{ fontSize: '1rem' }}>첫 번째 시네마 아카이브를 기다리고 있습니다.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
