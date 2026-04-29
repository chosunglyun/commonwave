# 지역 언론사 보일러플레이트 템플릿 가이드

본 프로젝트는 지역 인터넷 언론사 구축을 위한 보일러플레이트(템플릿)로 구성되어 있습니다.
새로운 사이트를 생성하려면 아래 단계를 따르세요.

## 1. 템플릿 설정 변경 (`constants/siteConfig.ts`)
`constants/siteConfig.ts` 파일 하나만 수정하면 사이트 전체의 이름, 로고, 슬로건, 푸터 정보 등이 일괄 변경됩니다.
- `name`: 사이트명 (예: 다산어보 -> 새 사이트명)
- `englishName`: 영문명
- `colors`: 테마 색상 지정
- `categories`: 메인 네비게이션 카테고리 구성
- `contact`: 푸터 하단의 발행인, 편집인, 연락처 등 기재

## 2. 환경 변수 설정 (`.env.local`)
`.env.example` 파일을 복사하여 `.env.local`로 이름을 변경하고, 새 프로젝트의 인증키를 입력하세요.
- **Supabase**: 새 Supabase 프로젝트의 URL과 Key 입력
- **Google API / EmailJS 등**: 필요 시 발급받아 연동

## 3. 데이터베이스(Supabase) 스키마 구성
새 Supabase 프로젝트에서 아래 핵심 테이블들을 생성해야 합니다. (이후 마이그레이션 파일이나 SQL 덤프 활용)
- `articles` (기사 데이터)
- `categories` (카테고리 정보)
- `users` (관리자/기자 계정)
- `report_submissions` (제보/기사 투고)

## 4. 로고 및 에셋 교체
`public/` 폴더 내에 있는 로고 파일 및 파비콘 등을 새 사이트에 맞게 교체하세요.

위 4단계를 완료한 후 `npm run dev`를 실행하면 새로운 사이트로 즉시 구동됩니다.
