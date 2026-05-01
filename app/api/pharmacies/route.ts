import { NextResponse } from 'next/server';

export const revalidate = 3600; // 1 hour caching

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sigunNm = searchParams.get('sigunNm') || '김포시';
  
  const API_KEY = process.env.GG_DATA_API_KEY;
  
  if (!API_KEY || API_KEY === '여기에_발급받으신_인증키를_붙여넣으세요') {
    return NextResponse.json({ error: 'GG_DATA_API_KEY not configured in .env.local' }, { status: 500 });
  }

  try {
    // pSize=1000 to get enough data for the full list
    const url = `https://openapi.gg.go.kr/ParmacyInfo?KEY=${API_KEY}&Type=json&SIGUN_NM=${encodeURIComponent(sigunNm)}&pSize=1000`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.ParmacyInfo && data.ParmacyInfo[1]) {
      const rows = data.ParmacyInfo[1].row;
      
      // Filter for pharmacies open on Sunday or holidays
      const holidayPharmacies = rows.filter((r: any) => 
        r.SUN_BEGIN_TREAT_TM !== null || r.HOLIDAY_BEGIN_TREAT_TM !== null
      );

      return NextResponse.json({ data: holidayPharmacies });
    } else {
      return NextResponse.json({ error: 'Data not found', raw: data }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch', message: error.message }, { status: 500 });
  }
}
