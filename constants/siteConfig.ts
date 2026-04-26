/**
 * NEWS PLATFORM TEMPLATE CONFIGURATION
 * ------------------------------------
 * 이 파일의 값만 수정하면 새로운 뉴스 사이트 브랜딩이 즉시 적용됩니다.
 */

export const SITE_CONFIG = {
  // 1. 브랜드 정보
  brand: {
    name: "COMMON WAVE",
    name_kr: "커먼 웨이브",
    slogan: "시민이 주주가 되고, 이웃이 기자가 되는 공동체의 진짜 목소리",
    sub_slogan: "Come on, ride the wave.",
    description: "데이터로 진실을 드러내고, 이웃의 삶을 기록하는 시민 참여형 뉴스 플랫폼입니다.",
    keywords: "뉴스, 시민기자, 공동체, 데이터저널리즘, 커먼웨이브",
    domain: "https://commonwave.vercel.app", // 배포 후 주소로 변경
  },

  // 2. 컬러 시스템 (HSL 또는 Hex)
  colors: {
    primary: "#14213D",      // 메인 컬러 (Urban Deep Blue)
    primary_dark: "#0B1221",
    primary_light: "#E5E9F0",
    accent: "#FCA311",       // 강조 컬러 (Orange Yellow)
    accent_dark: "#D48806",
    text_main: "#1a1a1a",
    background: "#F4F6FA",
  },

  // 3. 메뉴 카테고리 설정
  categories: [
    { label: '데이터 리포트', href: '/data-report' },
    { label: '권력 감시', href: '/power-surveillance' },
    { label: '로컬 인물', href: '/local-people' },

    { label: '인문학적 시선', href: '/humanities', 
      subItems: [
        { label: '시네마 아카이브', href: '/humanities/cinema-archive' }
      ]
    },
    { label: '커먼 픽', href: '/common-pick' },
    { label: '웨이브 멤버십', href: '/membership' },
  ],

  // 4. 지역 및 날씨 설정
  location: {
    city: "Gimpo", // 날씨를 가져올 도시 (영어)
  },

  // 5. 지역 카테고리 (필요한 경우)
  regions: ["김포", "전국/일반"],

  // 5. 회원 등급 명칭
  roles: {
    admin: "관리자",
    editor: "편집자",
    reporter: "리포터",
    member: "조합원",
    normal: "일반회원",
    subscriber: "구독자"
  },

  // 6. 소셜 미디어 및 연락처
  contact: {
    email: "zsunglyun@gmail.com",
    phone: "031-000-0000",
    address: "경기도 김포시",
    copyright: "© 2026 COMMON WAVE. All rights reserved.",
  }
};
