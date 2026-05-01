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
    const url = `https://openapi.gg.go.kr/GasStationAvgPrice?KEY=${API_KEY}&Type=json&SIGUN_NM=${encodeURIComponent(sigunNm)}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    // 경기 데이터드림 API의 정상 응답 구조 확인
    if (data.GasStationAvgPrice && data.GasStationAvgPrice[1]) {
      const rows = data.GasStationAvgPrice[1].row;
      return NextResponse.json({ data: rows });
    } else {
      return NextResponse.json({ error: 'Data not found', raw: data }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch', message: error.message }, { status: 500 });
  }
}
