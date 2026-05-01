/**
 * COMMON WAVE 4대 권역 메타 정보.
 *
 * 분야(category)와 동일 패턴이지만 별도 모듈로 분리. 한 카드에 분야 + 권역이
 * 같이 들어갈 수 있고, 둘은 다른 시각 언어(분야=배지, 권역=점)를 쓴다.
 */
export const REGION_META = {
  '김포': {
    key: 'gimpo',   slug: 'gimpo',
    label: '김포',    tone: '클래식 블루',
    motif: '평화·문화',
  },
  '파주': {
    key: 'paju',   slug: 'paju',
    label: '파주',    tone: '보라',
    motif: '출판·예술',
  },
  '고양': {
    key: 'goyang',   slug: 'goyang',
    label: '고양',    tone: '딥 그린',
    motif: '꽃·호수',
  },
  '의정부': {
    key: 'uijeongbu', slug: 'uijeongbu',
    label: '의정부',    tone: '오렌지',
    motif: '희망·도약',
  },
} as const

export type RegionName = keyof typeof REGION_META
export type RegionKey  = (typeof REGION_META)[RegionName]['key']
export type RegionMeta = (typeof REGION_META)[RegionName]

export function getRegionMeta(name: string): RegionMeta | null {
  return (REGION_META as Record<string, RegionMeta>)[name] ?? null
}

export function getRegionMetaBySlug(slug: string): RegionMeta | null {
  return Object.values(REGION_META).find((m) => m.slug === slug) ?? null
}

export const REGION_KEYS: readonly RegionKey[] = Object.values(REGION_META).map(
  (m) => m.key,
) as readonly RegionKey[]
