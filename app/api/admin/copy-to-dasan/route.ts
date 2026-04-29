import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const dasanAdmin = createClient(
  process.env.DASAN_SUPABASE_URL!,
  process.env.DASAN_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  // 관리자 인증
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { articleIds, category } = await request.json();
  if (!articleIds || articleIds.length === 0) {
    return NextResponse.json({ error: '기사를 선택해 주세요.' }, { status: 400 });
  }

  // 커먼웨이브에서 선택된 기사 가져오기
  const { data: articles, error: fetchError } = await supabaseAdmin
    .from('articles')
    .select('*')
    .in('id', articleIds);

  if (fetchError || !articles) {
    return NextResponse.json({ error: '기사 조회 실패: ' + fetchError?.message }, { status: 500 });
  }

  // 다산어보 형식으로 변환 후 삽입
  const toInsert = articles.map(a => ({
    title: a.title,
    content: a.content,
    image_url: a.image_url || null,
    category: category || a.category || '일반',
    status: 'published',
    slug: a.slug || null,
    view_count: 0,
    is_top: false,
    is_featured: false,
    image_caption: null,
    high_res_image_url: null,
    author_id: null,
  }));

  const { data: inserted, error: insertError } = await dasanAdmin
    .from('articles')
    .insert(toInsert)
    .select('id, title');

  if (insertError) {
    return NextResponse.json({ error: '다산어보 저장 실패: ' + insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, count: inserted?.length, articles: inserted });
}
