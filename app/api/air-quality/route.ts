import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sidoName = searchParams.get('sidoName') || '전남'; // 기본값 전남 (필요시 변경)
  const stationName = searchParams.get('stationName'); // 특정 측정소 지정 시

  const apiKey = process.env.AIR_KOREA_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
  }

  try {
    // 공공데이터포털 대기오염정보 API 호출 URL
    const url = `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=${apiKey}&returnType=json&numOfRows=100&pageNo=1&sidoName=${encodeURIComponent(sidoName)}&ver=1.0`;
    
    // API 한도 및 성능을 위해 서버단에서 1시간 단위로 캐시 (Next.js App Router 기능)
    const response = await fetch(url, { next: { revalidate: 3600 } }); 
    const data = await response.json();

    if (data.response?.header?.resultCode !== '00') {
      throw new Error(data.response?.header?.resultMsg || 'API 요청에 실패했습니다.');
    }

    const items = data.response.body.items;
    if (!items || items.length === 0) {
      return NextResponse.json({ pm10Value: '-', pm10Grade: '-', grade: '정보없음' });
    }

    // 측정소가 명시되어 있다면 해당 측정소 데이터를, 아니면 첫 번째 측정소 데이터를 가져옴
    const targetItem = stationName ? items.find((item: any) => item.stationName === stationName) || items[0] : items[0];

    // 미세먼지 등급 변환 로직 (1: 좋음, 2: 보통, 3: 나쁨, 4: 매우나쁨)
    const gradeMap: Record<string, string> = {
      '1': '좋음',
      '2': '보통',
      '3': '나쁨',
      '4': '매우나쁨'
    };

    const grade = gradeMap[targetItem.pm10Grade] || '보통';

    return NextResponse.json({
      stationName: targetItem.stationName,
      pm10Value: targetItem.pm10Value,
      pm10Grade: targetItem.pm10Grade,
      grade: grade
    });

  } catch (error) {
    console.error('Air Quality API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
