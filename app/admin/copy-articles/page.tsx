'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Copy, CheckSquare, Square } from 'lucide-react';

export default function CopyToDasanPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<any[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [category, setCategory] = useState('지역');
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
      if (!profile || profile.role !== 'admin') { router.push('/'); return; }

      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });

      // 커먼웨이브 기사 목록 가져오기
      const { data } = await supabase
        .from('articles')
        .select('id, title, category, created_at, status')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      setArticles(data || []);
      setLoading(false);
    };
    init();
  }, [router]);

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === articles.length) setSelected(new Set());
    else setSelected(new Set(articles.map(a => a.id)));
  };

  const handleCopy = async () => {
    if (selected.size === 0) { alert('복사할 기사를 선택해 주세요.'); return; }
    if (!confirm(`선택한 ${selected.size}개의 기사를 다산어보로 복사하시겠습니까?`)) return;

    setCopying(true);
    const { data: { session } } = await supabase.auth.getSession();

    const res = await fetch('/api/admin/copy-to-dasan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`
      },
      body: JSON.stringify({ articleIds: Array.from(selected), category })
    });

    const result = await res.json();
    setCopying(false);

    if (!res.ok) {
      alert('복사 실패: ' + result.error);
    } else {
      alert(`✅ ${result.count}개의 기사가 다산어보로 복사되었습니다!`);
      setSelected(new Set());
    }
  };

  if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>로딩 중...</div>;

  return (
    <main style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Header />
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
        <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          <ChevronLeft size={16} /> 편집국 메인으로 돌아가기
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>다산어보로 기사 복사</h1>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: '0.3rem 0 0' }}>
              복사할 기사를 선택하고 다산어보의 카테고리를 지정하세요.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#666', marginRight: '0.5rem' }}>다산어보 카테고리:</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
              >
                <option value="지역">지역</option>
                <option value="정치">정치</option>
                <option value="경제">경제</option>
                <option value="사회">사회</option>
                <option value="문화">문화</option>
                <option value="칼럼">칼럼</option>
              </select>
            </div>

            <button
              onClick={handleCopy}
              disabled={copying || selected.size === 0}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '10px 20px', background: selected.size > 0 ? '#2E7D52' : '#ccc',
                color: 'white', border: 'none', borderRadius: '10px',
                cursor: selected.size > 0 ? 'pointer' : 'not-allowed',
                fontWeight: 'bold', fontSize: '0.95rem'
              }}
            >
              <Copy size={18} />
              {copying ? '복사 중...' : `${selected.size}개 다산어보로 복사`}
            </button>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #eee', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb', borderBottom: '2px solid #eee' }}>
              <tr>
                <th style={{ padding: '1rem', width: '50px' }}>
                  <button onClick={toggleAll} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                    {selected.size === articles.length && articles.length > 0
                      ? <CheckSquare size={20} color="#2E7D52" />
                      : <Square size={20} color="#aaa" />}
                  </button>
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.9rem' }}>제목</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.9rem' }}>카테고리</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.9rem' }}>작성일</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(article => (
                <tr
                  key={article.id}
                  onClick={() => toggleSelect(article.id)}
                  style={{
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    background: selected.has(article.id) ? '#f0fdf4' : 'white'
                  }}
                >
                  <td style={{ padding: '1rem' }}>
                    {selected.has(article.id)
                      ? <CheckSquare size={20} color="#2E7D52" />
                      : <Square size={20} color="#ddd" />}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 600, fontSize: '0.95rem' }}>{article.title}</td>
                  <td style={{ padding: '1rem', color: '#666', fontSize: '0.9rem' }}>{article.category}</td>
                  <td style={{ padding: '1rem', color: '#999', fontSize: '0.85rem' }}>
                    {new Date(article.created_at).toLocaleDateString('ko-KR')}
                  </td>
                </tr>
              ))}
              {articles.length === 0 && (
                <tr><td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: '#999' }}>발행된 기사가 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
