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
    // 공공데이터포털은 인코딩된 키를 요구하므로, 사용자가 디코딩 키를 넣었든 인코딩 키를 넣었든 안전하게 변환
    let safeApiKey = apiKey;
    if (apiKey.includes('%')) {
      // 이미 인코딩된 키인 경우
      safeApiKey = apiKey;
    } else {
      // 디코딩된 키인 경우 인코딩
      safeApiKey = encodeURIComponent(apiKey);
    }

    // 공공데이터포털 대기오염정보 API 호출 URL
    const url = `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=${safeApiKey}&returnType=json&numOfRows=100&pageNo=1&sidoName=${encodeURIComponent(sidoName)}&ver=1.0`;
    
    // API 한도 및 성능을 위해 서버단에서 1시간 단위로 캐시 (Next.js App Router 기능)
    const response = await fetch(url, { next: { revalidate: 0 } }); // 디버깅을 위해 임시로 캐시 끔
    
    // 응답을 텍스트로 먼저 받아서 확인 (XML 에러인지, JSON인지 판별)
    const rawText = await response.text();
    
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseError) {
      // JSON 파싱 에러면 공공데이터포털에서 XML 에러(키 오류, 트래픽 초과 등)를 뱉은 것임
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

  } catch (error: any) {
    console.error('Air Quality API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data', detail: error.toString() }, { status: 500 });
  }
}
