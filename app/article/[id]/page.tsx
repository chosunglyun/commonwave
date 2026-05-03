import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Clock, User, Share2, Eye } from 'lucide-react';
import DeleteArticleButton from '@/components/DeleteArticleButton';
import ShareArticleButton from '@/components/ShareArticleButton';
import Comments from '@/components/Comments';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import ViewCounter from '@/components/ViewCounter';
import { SITE_CONFIG } from '@/constants/siteConfig';
import Footer from '@/components/Footer';
import CategoryBadge from '@/components/ui/CategoryBadge';
import { generateSlug } from '@/lib/utils/slugify';

export const revalidate = 0; // Ensure data is always fetch freshly

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  
  let decodedId = '';
  try {
    decodedId = decodeURIComponent(id).normalize('NFC');
  } catch (e) {
    decodedId = id.normalize('NFC');
  }

  let article = null;
  
  if (isUUID) {
    const { data } = await supabase.from('articles').select('*').eq('id', id).single();
    article = data;
  } else {
    // 1. Try exact slug match
    const { data: directMatch } = await supabase.from('articles').select('*').ilike('slug', decodedId).single();
    article = directMatch;
    
    // 2. Try matching after processing (handles truncation/special chars in URL)
    if (!article) {
      const processedId = generateSlug(decodedId);
      const { data: processedMatch } = await supabase.from('articles').select('*').ilike('slug', processedId).single();
      article = processedMatch;
    }
    
    // 3. Try searching by Title directly (if URL is the title)
    if (!article) {
      const { data: titleMatch } = await supabase.from('articles').select('*').ilike('title', decodedId).single();
      article = titleMatch;
    }
    
    // 4. Try history
    if (!article) {
      const { data: history } = await supabase.from('article_slug_history').select('article_id').eq('old_slug', decodedId).single();
      if (history?.article_id) {
        const { data: historyMatch } = await supabase.from('articles').select('*').eq('id', history.article_id).single();
        article = historyMatch;
      }
    }
  }
  
  if (!article) return { 
    title: '기사를 찾을 수 없습니다', 
    openGraph: {
      images: [{ url: `${SITE_CONFIG.url}/og-image.png` }]
    }
  };
  
  // Clean description: remove HTML, Markdown, and extra whitespace
  const contentSnippet = article.content 
    ? article.content
        .replace(/<[^>]*>/g, '') // Remove HTML
        .replace(/[#*`~_\[\]()]/g, '') // Remove Markdown characters
        .replace(/\s+/g, ' ') // Collapse whitespace
        .trim()
        .substring(0, 160) + '...'
    : 'COMMON WAVE 지역 뉴스';

  const encodedSlug = encodeURIComponent(article.slug || article.id);
  const url = `${SITE_CONFIG.url}/article/${encodedSlug}`;
  const imageUrl = article.image_url || `${SITE_CONFIG.url}/og-image.png`;
  
  const title = `${article.title} | ${SITE_CONFIG.name}`;

  return {
    title,
    description: contentSnippet,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: contentSnippet,
      images: [
        {
          url: imageUrl,
          secureUrl: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
          type: 'image/jpeg', // Always use image/jpeg as we convert it in the API
        }
      ],
      url: url,
      type: 'article',
      publishedTime: article.created_at,
      authors: [article.author_name || 'COMMON WAVE'],
      section: article.category,
      siteName: SITE_CONFIG.name,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: contentSnippet,
      images: [imageUrl],
    }
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const { data: { session } } = await supabase.auth.getSession();
  
  let decodedId = '';
  try {
    decodedId = decodeURIComponent(id).normalize('NFC');
  } catch (e) {
    decodedId = id.normalize('NFC');
  }

  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  
  let article = null;
  let error = null;

  if (isUUID) {
    const { data, error: err } = await supabase.from('articles').select('*').eq('id', id).single();
    article = data;
    error = err;
  } else {
    // 1. Try exact slug
    const { data: directMatch } = await supabase.from('articles').select('*').ilike('slug', decodedId).single();
    article = directMatch;
    
    // 2. Try processed slug
    if (!article) {
      const processedId = generateSlug(decodedId);
      const { data: processedMatch } = await supabase.from('articles').select('*').ilike('slug', processedId).single();
      article = processedMatch;
    }
    
    // 3. Try direct Title search
    if (!article) {
      const { data: titleMatch } = await supabase.from('articles').select('*').ilike('title', decodedId).single();
      article = titleMatch;
    }
    
    // 4. Try history
    if (!article) {
      const { data: history } = await supabase.from('article_slug_history').select('article_id').eq('old_slug', decodedId).single();
      if (history?.article_id) {
        const { data: currentArticle } = await supabase.from('articles').select('slug').eq('id', history.article_id).single();
        if (currentArticle?.slug) {
          redirect(`/article/${currentArticle.slug}`);
        }
      }
    }
  }

  if (error || !article) {
    console.error("Supabase Error fetch article:", error);
    notFound();
  }

  // Fetch author profile separately to avoid join issues
  const { data: authorProfile } = await supabase
    .from('profiles')
    .select('name, role')
    .eq('id', article.author_id)
    .single();

  const date = new Date(article.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Seoul'
  });
  
  // Auth check for delete button
  let userProfileForAuth = null;
  if (session?.user) {
    const { data: p } = await supabase.from('profiles').select('id, role').eq('id', session.user.id).single();
    userProfileForAuth = p;
  }
  
  const isAuthorizedToDelete = session?.user && (
    userProfileForAuth?.role === 'admin' || 
    userProfileForAuth?.role === 'editor' || 
    article.author_id === session.user.id
  );

  // Role display mapping
  const roleLabels: any = {
    'admin': '기자',
    'editor': '기자',
    'reporter': '마을리포터',
    'member': '조합원 기자'
  };
  
  // Robust author resolution
  let authorRole = '기자';
  let authorName = article.author_name || '관리자';

  if (authorProfile) {
    authorRole = roleLabels[authorProfile.role] || '기자';
    authorName = authorProfile.name || authorName;
  } else if (!article.author_name || article.author_name === '관리자') {
    authorRole = '기자';
    authorName = 'COMMON WAVE';
  }

  // Fetch recent articles for sidebar
  const { data: recentArticles } = await supabase
    .from('articles')
    .select('id, title, created_at, category, slug')
    .eq('status', 'published')
    .neq('id', article.id) // current article excluded
    .order('created_at', { ascending: false })
    .limit(5);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    image: article.image_url ? [article.image_url] : [`${SITE_CONFIG.url}/fallback/article-default.svg`],
    datePublished: article.created_at,
    author: [{
      '@type': 'Person',
      name: authorName
    }],
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/logo.png`
      }
    },
    articleSection: article.category,
    articleBody: article.content ? article.content.replace(/<[^>]*>/g, '').replace(/[#*`~]/g, '').substring(0, 500) : ''
  };

  return (
    <main style={{ minHeight: '100vh', background: '#fcfcfc' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <ViewCounter articleId={article.id} />
        <div className="article-layout" style={{ display: 'grid', gap: '3rem' }}>
          <article className="article-card" style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            {/* Breadcrumb */}
            <div style={{ marginBottom: '2rem' }}>
              <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#888', textDecoration: 'none', fontSize: '0.85rem' }}>
                <ChevronLeft size={14} /> 메인으로
              </Link>
            </div>

            {/* Header */}
            <header style={{ marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #eee' }}>
              <div style={{ marginBottom: '1rem' }}>
                <CategoryBadge category={article.category} size="md" variant="solid" />
              </div>
              <h1 className="article-title" style={{ 
                fontWeight: 900, 
                margin: '1rem 0 1.5rem',
                lineHeight: 1.25,
                fontFamily: '"Nanum Myeongjo", serif',
                wordBreak: 'keep-all',
                color: '#111',
                fontSize: '2.2rem',
                letterSpacing: '-0.02em'
              }}>
                {article.title}
              </h1>
              <style dangerouslySetInnerHTML={{ __html: `
                @media (max-width: 768px) {
                  .article-title { 
                    font-size: 1.5rem !important; 
                    line-height: 1.35 !important;
                    word-break: break-all !important;
                  }
                }
              ` }} />

              <div className="meta-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#777', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                    <div style={{ 
                      width: '26px', 
                      height: '26px', 
                      background: 'var(--primary-light)', 
                      color: 'var(--primary-dark)', 
                      borderRadius: '50%', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '11px', 
                      fontWeight: 900,
                      flexShrink: 0
                    }}>
                      {authorName[0]}
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <strong style={{ color: '#444' }}>{authorRole}</strong>
                      <span style={{ fontWeight: 500, color: '#333' }}>{authorName}</span>
                    </span>
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={12} /> {date}
                  </span>
                  {article.view_count !== undefined && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginLeft: '1.2rem', paddingLeft: '1.2rem', borderLeft: '1px solid #eee' }}>
                      <Eye size={12} /> <span style={{ opacity: 0.8 }}>{article.view_count.toLocaleString()}</span>
                    </span>
                  )}
                </div>
                
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  {isAuthorizedToDelete && <DeleteArticleButton articleId={article.id} />}
                  <ShareArticleButton />
                </div>
              </div>
            </header>

            {/* Content */}
            <div style={{ fontSize: '1.1rem', lineHeight: '2', color: '#333', fontFamily: '"Nanum Myeongjo", serif' }}>
              {article.image_url && (
                <figure className="article-figure" style={{ margin: '0 0 3.5rem 0', textAlign: 'center' }}>
                  <Image 
                    src={article.image_url} 
                    alt={article.title} 
                    width={800}
                    height={500}
                    priority
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px', display: 'block', margin: '0 auto' }} 
                  />
                  <figcaption style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.7rem', paddingLeft: '0.5rem', borderLeft: '2px solid var(--primary)' }}>
                    {article.image_caption || `${article.title} 관련 자료 사진. ⓒ ${SITE_CONFIG.name}`}
                  </figcaption>
                </figure>
              )}

              <MarkdownRenderer content={article.content || ''} />
            </div>

          {/* Comments Section */}
          <Comments articleId={article.id} />

          {/* Footer Info Box */}
          <footer style={{ marginTop: '5rem', borderTop: '4px solid #f0f0f0', paddingTop: '2rem' }}>
              <div style={{ background: '#f9fafb', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 0.8rem', fontSize: '1.2rem', fontWeight: 800 }}>COMMON WAVE 주민 기자단에 참여하세요!</h4>
                <p style={{ margin: 0, color: '#777', fontSize: '0.9rem', lineHeight: 1.6 }}>현장의 목소리를 직접 전해주세요. 여러분의 제보가 우리 지역의 역사가 됩니다.</p>
                <Link href="/report">
                  <button className="btn btn-primary" style={{ marginTop: '1.5rem', padding: '0.7rem 2rem' }}>제보하기</button>
                </Link>
              </div>
            </footer>
          </article>

          {/* Sidebar */}
          <aside className="desktop-only" style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
            <div style={{ borderTop: '2px solid #333', paddingTop: '1rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1.5rem' }}>가장 최근 뉴스</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {recentArticles?.map(art => (
                  <Link key={art.id} href={`/article/${art.slug ?? art.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ cursor: 'pointer', marginBottom: '1rem' }}>
                      <CategoryBadge category={art.category} />
                      <h4 style={{ fontSize: '0.95rem', margin: '0.3rem 0', lineHeight: 1.4, fontWeight: 700 }}>{art.title}</h4>
                      <span style={{ fontSize: '0.75rem', color: '#bbb' }}>{new Date(art.created_at).toLocaleDateString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}
