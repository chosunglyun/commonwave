/**
 * News Platform Template v1.0 - Configuration
 * 모든 신문사 공통 설정값들을 여기서 관리합니다.
 */

export const SITE_CONFIG = {
  name: "COMMON WAVE",
  englishName: "COMMON WAVE",
  slogan: "경기 서북부 밀착 독립언론 · LOCAL MEDIA",
  description: "김포·파주·고양·의정부 밀착 독립언론. 투명한 보도와 주민 참여로 지역의 미래를 씁니다.",
  
  // 브랜딩 컬러
  colors: {
    primary: "#3950C4", // 커먼웨이브 클래식 블루
    primaryDark: "#2b3c94",
    accent: "#6c81f0", // 밝은 블루 계열
  },
  
  // UI 라벨 (영문 대문자 한글화)
  labels: {
    topNews: "주요 뉴스",
    importantNews: "추천 기사",
    community: "독자 참여",
    subscription: "구독",
    report: "제보",
    ad: "광고",
  },
  
  // 지역 설정 (날씨 등)
  location: {
    city: "Gimpo",
    cityKR: "김포",
  },
  
  // 메뉴 카테고리
  categories: [
    { label: '전체기사', href: '/region' },
    { label: '김포', href: '/gimpo', region: true },
    { label: '파주', href: '/paju', region: true },
    { label: '고양', href: '/goyang', region: true },
    { label: '의정부', href: '/uijeongbu', region: true },
    { label: '인문학', href: '/humanities' },
    { label: '영화 아카이브', href: '/cinema-archive' },
    { label: '시민참여', href: '/citizen-participation' },
    { label: '지역사람들', href: '/local-people' },
    // { label: '기획연재', href: '/series', enabled: false }, // 콘텐츠 추가 시 활성화
    // { label: '포토', href: '/photo', enabled: false },     // 콘텐츠 추가 시 활성화
    { label: '이용안내', href: '/guide' },
    { label: '기사제보', href: '/report', accent: true },
  ] as { label: string; href: string; region?: boolean; accent?: boolean; enabled?: boolean }[],
  
  // 등록 상태
  isRegistered: false,
  
  // 연락처 및 하단 정보
  contact: {
    publisher: "-",
    editor: "-",
    youthProtector: "-",
    corporation: "COMMON WAVE",
    registrationNumber: "(등록 진행 중)",
    registrationDate: "-",
    address: "경기도",
    phone: "031-000-0000",
    fax: "031-000-0001",
    email: "editor@commonwave.kr",
    temporaryContact: {
      label: '연락처',
      value: '대표 이메일로 문의 부탁드립니다',
      email: 'editor@commonwave.kr',
    },
  },
  url: "https://www.commonwave.kr"
};

