/**
 * News Platform Template v1.0 - Configuration
 * 모든 신문사 공통 설정값들을 여기서 관리합니다.
 */

export const SITE_CONFIG = {
  name: "커먼 웨이브 : COMMON WAVE",
  englishName: "COMMON WAVE",
  slogan: "Come on, ride the wave.",
  description: "시민이 주주가 되고, 이웃이 기자가 되는 공동체의 진짜 목소리",
  
  // 브랜딩 컬러
  colors: {
    primary: "#1B3A6B", // 미드나잇 블루
    primaryDark: "#0A0F1E", // 딥 블랙
    accent: "#00C9B1", // 네온 시안
  },
  
  // 지역 설정 (날씨 등)
  location: {
    city: "Gangjin",
    cityKR: "강진",
  },
  
  // 메뉴 카테고리
  categories: [
    { label: '웨이브 인덱스', href: '/wave-index' },
    { label: '유리알 워치', href: '/glass-watch' },
    { label: '피플 로그', href: '/people-log' },
    { label: '언필터드', href: '/unfiltered' },
    { label: '액션 스퀘어', href: '/action-square' },
    { label: '커먼 픽', href: '/common-pick' },
    { label: '웨이브 멤버십', href: '/membership' },
  ] as { label: string; href: string; region?: boolean; accent?: boolean }[],
  
  // 연락처 및 하단 정보
  contact: {
    email: "dinoskorea@gmail.com",
    address: "전라남도 강진군 강진읍",
    registrationNumber: "123-45-67890",
  }
};
