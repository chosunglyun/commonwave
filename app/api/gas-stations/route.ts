import { NextResponse } from 'next/server';

// 1시간(3600초) 단위로만 캐싱하여 외부 API 호출 횟수 최소화
export const revalidate = 3600;

export async function GET() {
  const API_KEY = process.env.GG_DATA_API_KEY;
  const sigunNm = '김포시';
  
  if (!API_KEY || API_KEY === '여기에_발급받으신_인증키를_붙여넣으세요') {
    return NextResponse.json({ error: 'GG_DATA_API_KEY not configured in .env.local' }, { status: 500 });
  }

  try {
    const url = `https://openapi.gg.go.kr/GASSTATIONAVGPRICE?KEY=${API_KEY}&Type=json&SIGUN_NM=${encodeURIComponent(sigunNm)}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.GASSTATIONAVGPRICE && data.GASSTATIONAVGPRICE[1]) {
      const rows = data.GASSTATIONAVGPRICE[1].row;
      
      const prodMap: Record<string, string> = {
        'B027': '휘발유',
        'B034': '고급휘발유',
        'D047': '경유',
        'C004': '실내등유',
        'K015': 'LPG'
      };
      
      const formatted = rows.map((r: any) => ({
        ...r,
        DIV_NM: prodMap[r.PROD_DIV] || r.PROD_DIV,
        AVG_PRCE: r.AVG_PC,
        BFRT_CMPR_FLTCT_VAL: r.FLCTN_VL
      }));

      return NextResponse.json({ data: formatted });
    } else {
      return NextResponse.json({ error: 'Data not found', raw: data }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch', message: error.message }, { status: 500 });
  }
}
