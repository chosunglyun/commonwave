import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CommonWaveHome } from '@/components/CommonWaveHome';
import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function Home() {
  // Fetch all published articles
  const { data: recentArticles } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(60);

  const safeArticles = recentArticles || [];

  // Fetch farm prices
  const { data: farmPrices } = await supabase
    .from('farm_prices')
    .select('*')
    .order('item_name', { ascending: true });

  // Fetch member count
  const { count: memberCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const safeMemberCount = memberCount || 128; // Fallback

  return (
    <main style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <Header />
      
      {/* 새 메인 페이지 레이아웃 */}
      <CommonWaveHome
        articles={safeArticles}
        farmPrices={farmPrices || []}
        memberCount={safeMemberCount}
      />

      <Footer />
    </main>
  );
}
