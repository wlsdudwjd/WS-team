export type CafeteriaMenu = {
  slug: string
  name: string
  price: number
  description: string
}

export type CafeteriaCounter = {
  title: string
  subtitle: string
  status: string
  icon: string
  menus: CafeteriaMenu[]
}

export const cafeteriaCounters: Record<string, CafeteriaCounter> = {
  breakfast: {
    title: '🍚 ① 조식 (후생관)',
    subtitle: '추천 5개 이상',
    status: '영업중',
    icon: '🍚',
    menus: [
      { slug: 'baekban', name: '백반 정식', price: 5500, description: '따뜻한 국과 밥이 함께 나오는 한상 차림' },
      { slug: 'sausage-egg', name: '소시지 달걀 조식', price: 5200, description: '부드러운 달걀과 소시지 세트' },
      { slug: 'tuna-kimchi', name: '참치김치볶음 조식', price: 5400, description: '김치와 참치를 볶아낸 든든한 조식' },
      { slug: 'seaweed-rice', name: '김가루계란밥', price: 4500, description: '김가루와 계란을 비빈 간편식' },
      { slug: 'beef-seaweed-soup', name: '소고기 미역국 정식', price: 6000, description: '속이 편안한 미역국과 밥' },
      { slug: 'tofu-set', name: '두부부침 정식', price: 5300, description: '담백한 두부부침과 반찬이 곁들여진 조식' },
    ],
  },
  jjigae: {
    title: '🍲 ② 찌개 · 돌솥',
    subtitle: '추천 5개 이상',
    status: '영업중',
    icon: '🍲',
    menus: [
      { slug: 'kimchi-jjigae', name: '김치찌개', price: 6500, description: '얼큰한 김치찌개와 밥' },
      { slug: 'doenjang-jjigae', name: '된장찌개', price: 6200, description: '구수한 된장찌개' },
      { slug: 'soft-tofu', name: '순두부찌개', price: 6500, description: '부드러운 순두부가 듬뿍' },
      { slug: 'ttukbaegi-bulgogi', name: '뚝배기불고기', price: 7000, description: '달콤짭짤한 불고기를 뚝배기에' },
      { slug: 'dolsot-bibimbap', name: '돌솥비빔밥', price: 6900, description: '바삭한 누룽지가 매력적인 돌솥' },
      { slug: 'beef-doenjang', name: '차돌박이 된장찌개', price: 7200, description: '차돌이 들어 더욱 고소한 찌개' },
    ],
  },
  korean: {
    title: '🍱 ③ 한식',
    subtitle: '추천 5개 이상',
    status: '영업중',
    icon: '🍱',
    menus: [
      { slug: 'jaeyuk', name: '제육볶음', price: 7000, description: '매콤달콤 돼지고기 볶음' },
      { slug: 'bulgogi', name: '불고기정식', price: 7500, description: '달큰한 불고기와 밥 한 그릇' },
      { slug: 'dakgalbi', name: '닭갈비덮밥', price: 6800, description: '닭갈비를 듬뿍 올린 덮밥' },
      { slug: 'mackerel', name: '고등어구이 정식', price: 7200, description: '노릇하게 구운 고등어' },
      { slug: 'galbitang', name: '갈비탕', price: 7800, description: '맑고 진한 갈비탕' },
      { slug: 'bibimbap', name: '비빔밥', price: 6500, description: '다양한 나물이 어우러진 한 그릇' },
    ],
  },
  donkatsu: {
    title: '🍝 ⑤ 양식 · 돈까스',
    subtitle: '추천 5개 이상',
    status: '영업중',
    icon: '🍝',
    menus: [
      { slug: 'loin-katsu', name: '등심돈까스', price: 7300, description: '바삭한 정통 등심 돈까스' },
      { slug: 'cheese-katsu', name: '치즈돈까스', price: 7600, description: '치즈가 가득 들어간 돈까스' },
      { slug: 'curry-katsu', name: '카레돈까스', price: 7800, description: '카레 소스를 곁들인 돈까스' },
      { slug: 'cream-pasta', name: '크림파스타', price: 7200, description: '부드러운 크림소스 파스타' },
      { slug: 'tomato-pasta', name: '토마토파스타', price: 7000, description: '상큼한 토마토 베이스 파스타' },
      { slug: 'rose-pasta', name: '로제파스타', price: 7500, description: '크림과 토마토가 조화로운 로제' },
    ],
  },
  snack: {
    title: '🍢 ⑥ 분식',
    subtitle: '추천 5개 이상',
    status: '영업중',
    icon: '🍢',
    menus: [
      { slug: 'tteokbokki', name: '떡볶이', price: 4800, description: '매콤달콤한 국민 간식' },
      { slug: 'kimbap', name: '김밥', price: 3500, description: '한 줄 가득 정성' },
      { slug: 'cheese-kimbap', name: '치즈김밥', price: 3800, description: '치즈가 들어간 김밥' },
      { slug: 'sundae', name: '순대', price: 4000, description: '쫄깃한 순대 모둠' },
      { slug: 'fried-set', name: '튀김 모듬', price: 4200, description: '바삭한 튀김 3종 세트' },
      { slug: 'rabokki', name: '라볶이', price: 5200, description: '라면과 떡볶이의 조화' },
    ],
  },
  'ramen-salad': {
    title: '🍜 ⑦ 라면 · 샐러드',
    subtitle: '추천 5개 이상',
    status: '영업중',
    icon: '🍜',
    menus: [
      { slug: 'sarigomtang', name: '사리곰탕라면', price: 5500, description: '구수한 사리곰탕 라면' },
      { slug: 'cheese-ramen', name: '치즈라면', price: 5200, description: '치즈가 올라간 라면' },
      { slug: 'kimchi-ramen', name: '김치라면', price: 5200, description: '칼칼한 김치 라면' },
      { slug: 'chicken-salad', name: '샐러드(닭가슴살)', price: 6500, description: '닭가슴살이 올라간 샐러드' },
      { slug: 'caesar-salad', name: '시저샐러드', price: 6300, description: '클래식 시저 샐러드' },
      { slug: 'pasta-salad', name: '파스타 샐러드', price: 6400, description: '파스타와 채소가 어우러진 샐러드' },
    ],
  },
} as const

export type CafeteriaSlug = keyof typeof cafeteriaCounters
