import { NextResponse } from 'next/server';

export const runtime = 'edge'; // Vercel Edge 네트워크 사용 (접속자 위치 기반 실행으로 한국 IP 차단 우회)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sidoName = searchParams.get('sidoName') || '전남';

  // 클라이언트에서 넘긴 환경 변수든, 서버에 저장된 환경 변수든 모두 탐색하고 공백 제거
  const apiKey = (process.env.AIR_KOREA_API_KEY || process.env.NEXT_PUBLIC_AIR_KOREA_API_KEY || '').trim();
  
  if (!apiKey) {
    return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
  }

  try {
    let safeApiKey = apiKey;
    if (apiKey.includes('%')) {
      safeApiKey = apiKey; // 이미 인코딩된 키
    } else {
      safeApiKey = encodeURIComponent(apiKey); // 디코딩된 키인 경우 인코딩
    }

    const url = `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=${safeApiKey}&returnType=json&numOfRows=100&pageNo=1&sidoName=${encodeURIComponent(sidoName)}&ver=1.0`;
    
    // Edge에서 직접 공공데이터포털 요청 (CORS 문제 및 국가 차단 동시 우회)
    const response = await fetch(url, { next: { revalidate: 3600 } }); 
    const rawText = await response.text();
    
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseError) {
      console.error('XML/HTML Error Response:', rawText);
      return NextResponse.json({ error: '데이터포털 응답 형식 오류(XML 반환됨)', rawMsg: rawText }, { status: 500 });
    }

    if (data.response?.header?.resultCode !== '00') {
      return NextResponse.json({ error: 'API 요청 실패', msg: data.response?.header?.resultMsg }, { status: 500 });
    }

    const items = data.response.body.items;
    if (!items || items.length === 0) {
      return NextResponse.json({ pm10Value: '-', pm10Grade: '-', grade: '정보없음' });
    }

    const targetItem = items[0];
    const gradeMap: Record<string, string> = {
      '1': '좋음', '2': '보통', '3': '나쁨', '4': '매우나쁨'
    };
    const grade = gradeMap[targetItem.pm10Grade] || '보통';

    return NextResponse.json({
      stationName: targetItem.stationName,
      pm10Value: targetItem.pm10Value,
      pm10Grade: targetItem.pm10Grade,
      grade: grade
    });

  } catch (error: any) {
    console.error('Air Quality API Proxy Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data', detail: error.toString() }, { status: 500 });
  }
}
