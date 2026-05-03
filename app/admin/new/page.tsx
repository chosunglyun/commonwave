'use client';

import { useState, useEffect, Suspense } from 'react';
import Header from '@/components/Header';
import { Save, Image as ImageIcon, Layout, ChevronLeft, Type } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { marked } from 'marked';
import RichTextEditor from '@/components/RichTextEditor';
import { generateSlug } from '@/lib/utils/slugify';
import FeaturedPickSection from '@/components/admin/articles/FeaturedPickSection';
import { getActivePick } from '@/lib/queries/getActivePick';



function EditArticleForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const articleId = searchParams.get('id');
  const reportId = searchParams.get('reportId');
  
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageValidation, setImageValidation] = useState<{ message: string, isValid: boolean } | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    image_url: '',
    category: '사회',
    region: '김포',
    author_id: '',
    author_name: '',
    is_featured: false,
    pin_until: null as string | null
  });
  const [activePick, setActivePick] = useState<{ id: string; title: string; pin_until: string | null } | null>(null);
  const [authors, setAuthors] = useState<any[]>([]);
  const [bodyUploading, setBodyUploading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("로그인이 필요합니다!");
        router.push('/login');
        return;
      }
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      const allowedRoles = ['admin', 'editor', 'reporter', 'member'];
      if (!profile || !allowedRoles.includes(profile.role)) {
        alert("기사 작성 권한이 없습니다. (리포터 및 조합원 이상만 가능)");
        router.push('/');
        return;
      }
      setUserProfile(profile);

      if (articleId) {
        setIsEditMode(true);
        const { data: article } = await supabase
          .from('articles')
          .select('*')
          .eq('id', articleId)
          .single();
        
        if (article) {
          // Safety check for content
          const rawContent = article.content || '';
          // If it looks like Markdown (doesn't start with <), convert it to HTML
          const isMarkdown = !rawContent.trim().startsWith('<');
          const content = isMarkdown ? marked.parse(rawContent) : rawContent;
          
          setFormData({
            title: article.title || '',
            slug: article.slug || '',
            content: (content as string) || '',
            image_url: article.image_url || '',
            category: article.category || '사회',
            region: article.region || '김포',
            author_id: article.author_id || '',
            author_name: article.author_name || '',
            is_featured: article.is_featured || false,
            pin_until: article.pin_until || null
          });
        }
      } else if (reportId) {
        const { data: report } = await supabase.from('village_reports').select('*').eq('id', reportId).single();
        if (report) {
          const generatedContent = `**누가:** ${report.who || ''}  \n**무엇을:** ${report.what || ''}  \n**어디서:** ${report.where || ''}  \n**언제:** ${report.when || ''}  \n**어떻게:** ${report.how || ''}  \n**왜:** ${report.why || ''}  \n\n**추가 내용:** ${report.extra || ''}  \n\n*(제보자: ${report.sender_name || ''} 리포터 / 제보 스타일: ${report.style || ''})*`;
          const htmlContent = marked.parse(generatedContent);
          setFormData(prev => ({ 
            ...prev, 
            author_id: session.user.id,
            title: `[제보 바탕] ${report.what || ''}`,
            content: (htmlContent as string) || '',
            image_url: report.high_res_url || report.low_res_url || ''
          }));
        } else {
          setFormData(prev => ({ ...prev, author_id: session.user.id }));
        }
      } else {
        // Default author is the current user
        setFormData(prev => ({ ...prev, author_id: session.user.id }));
      }

      // If admin or editor or member, fetch all possible authors
      if (profile.role === 'admin' || profile.role === 'editor' || profile.role === 'member') {
        const { data: allProfiles } = await supabase
          .from('profiles')
          .select('id, name, role')
          .in('role', ['admin', 'editor', 'reporter', 'member'])
          .order('name');
        
        let fetchedAuthors = allProfiles || [];
        // Ensure 조성륜 is in the list even if no profile exists yet
        if (!fetchedAuthors.find(a => a.name === '조성륜')) {
          fetchedAuthors.push({ id: 'none-josunglyun', name: '조성륜', role: 'editor' });
        }
        setAuthors(fetchedAuthors);

        try {
          const pick = await getActivePick();
          if (pick) setActivePick(pick);
        } catch (err) {
          console.error("Active pick fetch error (might be missing column)", err);
        }
      }
      setAuthLoading(false);
    };
    checkAuth();
  }, [router, articleId]);

  const validateImage = (file: File): Promise<{ message: string, isValid: boolean }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        const ratio = width / height;
        
        if (width < 200 && height < 200) {
          resolve({ message: '⚠️ 해상도가 매우 낮습니다 (가급적 고해상도 이미지를 사용해주세요)', isValid: true });
          return;
        }
        
        // 세로 사진도 허용 (portrait)
        if (ratio < 1) {
          resolve({ message: '✅ 세로형 이미지입니다 (업로드 가능)', isValid: true });
          return;
        }
        
        // 가로 사진은 16:9 근사 권장이지만 강제하지 않음
        const targetRatio = 16 / 9;
        if (ratio >= targetRatio * 0.7) {
          resolve({ message: '✅ 이미지 업로드 가능합니다', isValid: true });
        } else {
          resolve({ message: '⚠️ 이미지 비율이 정사각형에 가깝습니다 (업로드는 가능)', isValid: true });
        }
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const uploadViaApi = async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    
    const response = await fetch('/api/upload-article-image', {
      method: 'POST',
      body: fd,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '업로드 실패');
    }
    
    return await response.json();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationResult = await validateImage(file);
    setImageValidation(validationResult);

    if (!validationResult.isValid) {
      // 유효하지 않은 경우에만 업로드 중단
      return;
    }

    setUploading(true);

    try {
      const result = await uploadViaApi(file);
      setFormData({ ...formData, image_url: result.publicUrl });
      alert('이미지가 안전하게 업로드되었습니다! (원본 보존 완료)');
    } catch (error: any) {
      alert('업로드 실패: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleBodyImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBodyUploading(true);

    try {
      const result = await uploadViaApi(file);
      const imageMarkdown = `\n\n![이미지](${result.publicUrl})\n\n`;
      setFormData(prev => ({ ...prev, content: prev.content + imageMarkdown }));
    } catch (error: any) {
      alert('본문 이미지 업로드 실패: ' + error.message);
    } finally {
      setBodyUploading(false);
      e.target.value = ''; // Reset for next time
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.title || !formData.content) {
      alert("제목과 내용을 모두 입력해주세요!");
      return;
    }
    setLoading(true);

    try {
      let finalSlug = formData.slug.trim() || generateSlug(formData.title);
      
      // Check slug uniqueness
      const { data: existing } = await supabase.from('articles').select('id').eq('slug', finalSlug).maybeSingle();
      if (existing && existing.id !== articleId) {
        finalSlug = `${finalSlug}-${Math.random().toString(36).substring(2, 6)}`;
      }

      // Validate pick date
      if (formData.is_featured && formData.pin_until) {
        const pinDate = new Date(formData.pin_until);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (pinDate < today) {
          alert("만료일은 오늘 이후여야 합니다.");
          setLoading(false);
          return;
        }
      }

      const payload = { 
        title: formData.title,
        slug: finalSlug,
        content: formData.content,
        image_url: formData.image_url,
        category: formData.category,
        region: formData.region,
        author_id: (formData.author_id && !formData.author_id.startsWith('none-')) ? formData.author_id : null,
        author_name: formData.author_name || null,
        is_featured: formData.is_featured,
        pin_until: formData.is_featured ? formData.pin_until : null
      };

      if (isEditMode && articleId) {
        // Log to history if slug changed
        const { data: currentArticle } = await supabase.from('articles').select('slug').eq('id', articleId).single();
        if (currentArticle && currentArticle.slug !== finalSlug && currentArticle.slug) {
          await supabase.from('article_slug_history').insert({ article_id: articleId, old_slug: currentArticle.slug });
        }
        
        const { error } = await supabase.from('articles').update(payload).eq('id', articleId);
        if (error) throw error;
        alert('기사가 성공적으로 수정되었습니다!');
      } else {
        const finalStatus = (userProfile.role === 'reporter') ? 'pending' : 'published';
        const { error } = await supabase.from('articles').insert([{ ...payload, status: finalStatus }]);
        if (error) throw error;
        alert('기사가 성공적으로 접수/발행되었습니다!');
      }
      router.push('/admin');
    } catch (err: any) {
      if (err?.message?.includes('is_featured')) {
        alert('DB 에러: is_featured 컬럼이 아직 추가되지 않았습니다. Supabase SQL 에디터에서 마이그레이션을 먼저 실행해주세요!');
      } else {
        alert('오류 발생: ' + err?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div style={{ padding: '10rem 0', textAlign: 'center', fontSize: '1.2rem', color: '#666' }}>권한을 확인하는 중입니다...</div>;
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
      <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem', textDecoration: 'none' }}>
        <ChevronLeft size={16} /> 관리자 메인으로 돌아가기
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>{isEditMode ? '기사 수정' : '기사 작성'}</h1>
        <button 
          onClick={handleSubmit}
          disabled={loading || uploading}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2.5rem', fontSize: '1rem', fontWeight: 'bold',
            background: 'var(--primary-dark)', color: 'white', border: 'none', borderRadius: '8px',
            cursor: (loading || uploading) ? 'not-allowed' : 'pointer', opacity: (loading || uploading) ? 0.7 : 1
          }}
        >
          <Save size={18} /> {loading ? (isEditMode ? '수정 중...' : '발행 중...') : (isEditMode ? '기사 수정하기' : '기사 발행하기')}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2.5rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <input 
            type="text" placeholder="기사 제목을 입력하세요"
            value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
            style={{ width: '100%', padding: '1rem 0', fontSize: '2.2rem', fontWeight: 800, border: 'none', borderBottom: '2px solid #eee', outline: 'none', fontFamily: '"Nanum Myeongjo", serif' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8f9fa', padding: '0.8rem', borderRadius: '6px' }}>
            <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: 'bold', whiteSpace: 'nowrap' }}>URL 슬러그 (선택)</span>
            <input 
              type="text" placeholder="입력하지 않으면 제목에서 자동 생성됩니다"
              value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})}
              style={{ width: '100%', padding: '0.4rem 0.8rem', fontSize: '0.85rem', border: '1px solid #ddd', borderRadius: '4px', outline: 'none' }}
            />
          </div>
          <div className="quill-wrapper">
            <input 
              type="file" accept="image/*" id="body-image-upload" 
              style={{ display: 'none' }} 
              onChange={handleBodyImageUpload} 
            />
            <RichTextEditor
              value={formData.content}
              onChange={(val) => setFormData({ ...formData, content: val })}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}><Layout size={18} /> 분류 설정</h4>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>카테고리</label>
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}>
                <optgroup label="── 전문 섹션 ──">
                  <option value="인문학">인문학</option>
                  <option value="영화 아카이브">영화 아카이브</option>
                  <option value="시민참여">시민참여</option>
                  <option value="지역사람들">지역사람들</option>
                </optgroup>
                <optgroup label="── 일반 분야 ──">
                  <option value="행정">행정</option>
                  <option value="정치">정치</option>
                  <option value="경제">경제</option>
                  <option value="사회">사회</option>
                  <option value="교육">교육</option>
                  <option value="문화">문화</option>
                  <option value="인터뷰">인터뷰</option>
                  <option value="칼럼">칼럼</option>
                </optgroup>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>지역</label>
              <select value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}>
                 <option>김포</option><option>파주</option><option>고양</option><option>의정부</option><option>전국/일반</option>
              </select>
            </div>
            {(userProfile?.role === 'admin' || userProfile?.role === 'editor' || userProfile?.role === 'member') && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>작성 기자 선택</label>
                <select 
                  value={formData.author_id} 
                  onChange={(e) => setFormData({...formData, author_id: e.target.value})} 
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', background: '#fff9db', marginBottom: '0.5rem' }}
                >
                  <option value="">-- 직접 입력 또는 선택 --</option>
                  {authors.map(a => (
                    <option key={a.id} value={a.id}>
                      [{a.role === 'reporter' ? '마을리포터' : (a.name === '조성륜' ? '기자' : '기자')}] {a.name}
                    </option>
                  ))}
                </select>
                
                <div style={{ marginTop: '0.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#666', marginBottom: '0.3rem' }}>바이라인 직접 입력 (조성륜 등)</label>
                  <input 
                    type="text" 
                    placeholder="기자명을 직접 입력하세요"
                    value={formData.author_name || ''} 
                    onChange={(e) => setFormData({...formData, author_name: e.target.value})}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.85rem' }}
                  />
                </div>
                <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.4rem' }}>* 선택 목록에 없는 기사는 이름을 직접 입력하세요.</p>
              </div>
            )}
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}><ImageIcon size={18} /> 썸네일 업로드</h4>
            <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem', lineHeight: '1.5', background: '#f8f9fa', padding: '0.8rem', borderRadius: '6px' }}>
              썸네일이 없으면 COMMON WAVE 기본 이미지로 표시됩니다. 가급적 기사 내용을 잘 보여주는 사진(현장 사진, 인물 사진 등)을 첨부해 주세요. 공문 스캔이나 표 이미지는 피해주세요.<br/>
              <strong>* 권장 비율:</strong> 1200×675 (16:9 가로형)<br/>
              <span style={{ fontSize: '0.75rem', color: '#888' }}>* 기준 미달 시, 홈 주요 뉴스에서 자동으로 텍스트 폴백 모드로 게재됩니다.</span>
            </div>
            {imageValidation && (
              <div style={{ padding: '0.6rem', marginBottom: '1rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, background: imageValidation.isValid ? '#dcfce7' : '#fee2e2', color: imageValidation.isValid ? '#166534' : '#991b1b' }}>
                {imageValidation.message}
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} style={{ display: 'none' }} id="image-upload" />
            <label htmlFor="image-upload" style={{ display: 'block', width: '100%', padding: '0.8rem', textAlign: 'center', background: uploading ? '#eee' : 'var(--primary)', color: '#fff', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '1rem' }}>
              {uploading ? '처리 중...' : '이미지 파일 선택'}
            </label>
            <div style={{ width: '100%', aspectRatio: '16/9', background: '#f8f9fa', border: '1px dashed #ccc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {formData.image_url ? <img src={formData.image_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: '#999', fontSize: '0.8rem' }}>이미지를 선택해 주세요.</span>}
            </div>
          </div>

          {(userProfile?.role === 'admin' || userProfile?.role === 'editor') && (
            <FeaturedPickSection
              article={{
                id: articleId || undefined,
                title: formData.title,
                image_url: formData.image_url,
                category: formData.category,
                author_id: formData.author_id,
                created_at: new Date().toISOString()
              }}
              activePick={activePick?.id !== articleId ? activePick : null}
              value={{ is_featured: formData.is_featured, pin_until: formData.pin_until }}
              onChange={({ is_featured, pin_until }) => setFormData({ ...formData, is_featured, pin_until })}
            />
          )}

        </div>
      </div>
    </div>
  );
}

export default function NewArticlePage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Header />
      <Suspense fallback={<div style={{ padding: '5rem', textAlign: 'center' }}>데이터 불러오는 중...</div>}>
        <EditArticleForm />
      </Suspense>
    </main>
  );
}
