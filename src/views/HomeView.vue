<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiGet } from '@/utils/api'

const router = useRouter()

type ServiceId = 'cafe' | 'cafeteria'

const services: { id: ServiceId; label: string; description: string; emoji: string }[] = [
  {
    id: 'cafe',
    label: '카페',
    description: '따뜻한 커피와 디저트',
    emoji: '☕',
  },
  {
    id: 'cafeteria',
    label: '학식',
    description: '든든한 학생 식당',
    emoji: '🍱',
  },
]

type RankItem = {
  name: string
  likes: number
  storeName?: string | null
}

type PopularMenuResponse = {
  menuId: number
  name: string
  price: number
  description?: string
  storeId: number | null
  storeName: string | null
  likeCount: number
}

type StoreResponse = {
  storeId: number
  name: string
  serviceType: {
    serviceTypeId: number
    name: string
  }
}

const topCafe = ref<RankItem[]>([])
const topCafeteria = ref<RankItem[]>([])
const loadingTop = ref(false)
const topError = ref<string | null>(null)

const storeTypeById = ref<Record<number, string>>({})

const fetchStores = async () => {
  const data = await apiGet<StoreResponse[]>('/api/stores')
  storeTypeById.value = data.reduce<Record<number, string>>((acc, store) => {
    acc[store.storeId] = store.serviceType?.name ?? ''
    return acc
  }, {})
}

const fetchTopMenus = async () => {
  loadingTop.value = true
  topError.value = null
  try {
    await fetchStores()
    const data = await apiGet<PopularMenuResponse[]>('/api/menu-likes/top?limit=5')

    const cafes: RankItem[] = []
    const cafeterias: RankItem[] = []

    data.forEach((item) => {
      const serviceType = item.storeId ? storeTypeById.value[item.storeId] : ''
      const target = serviceType?.toLowerCase().includes('cafeteria') ? cafeterias : cafes
      target.push({
        name: item.name,
        likes: item.likeCount ?? 0,
        storeName: item.storeName ?? undefined,
      })
    })

    topCafe.value = cafes
    topCafeteria.value = cafeterias
  } catch (err) {
    console.error(err)
    topCafe.value = []
    topCafeteria.value = []
    topError.value = '추천이 아직 없습니다.'
  } finally {
    loadingTop.value = false
  }
}

onMounted(fetchTopMenus)

const goRecommend = (type: 'cafe' | 'cafeteria') => {
  router.push(`/recommend/${type}`)
}
</script>

<template>
  <section class="home-screen">
    <p class="eyebrow">오늘의 추천</p>
    <h1 class="question">어떤 서비스를 이용하러 오셨나요?</h1>

    <div class="service-grid">
      <button
        v-for="service in services"
        :key="service.id"
        type="button"
        class="service-card"
        @click="router.push('/' + service.id)"
      >
        <div class="service-copy">
          <span class="service-label">{{ service.label }}</span>
          <span class="service-desc">{{ service.description }}</span>
        </div>

        <span class="service-emoji" aria-hidden="true">
          {{ service.emoji }}
        </span>
      </button>
    </div>

    <section class="recommend-area">
      <h2>메뉴 추천하기</h2>

      <div class="recommend-buttons">
        <button class="rec-btn cafe" @click="goRecommend('cafe')">
          카페 메뉴 추천하기
        </button>
        <button class="rec-btn caf" @click="goRecommend('cafeteria')">
          학식 메뉴 추천하기
        </button>
      </div>
    </section>

    <section class="ranking-board">
      <h2>🔥 오늘의 인기 메뉴 Top 5</h2>

      <div v-if="loadingTop" class="rank-empty">불러오는 중...</div>
      <div v-else-if="topError || (!topCafe.length && !topCafeteria.length)" class="rank-empty">
        {{ topError ?? '추천이 아직 없습니다.' }}
      </div>
      <template v-else>
        <h3 v-if="topCafe.length" class="rank-title">☕ 카페</h3>
        <ul v-if="topCafe.length" class="rank-list">
          <li v-for="item in topCafe" :key="item.name">
            <span>{{ item.name }}</span>
            <strong>{{ item.likes }} 👍</strong>
          </li>
        </ul>

        <h3 v-if="topCafeteria.length" class="rank-title">🍱 학식</h3>
        <ul v-if="topCafeteria.length" class="rank-list">
          <li v-for="item in topCafeteria" :key="item.name">
            <span>{{ item.name }}</span>
            <strong>{{ item.likes }} 👍</strong>
          </li>
        </ul>
      </template>
    </section>

    <section class="promo-board" aria-label="프로모션">
      <p class="promo-main">
        <span class="highlight">천원의 아침</span> 학생할인은
        <strong>멤버십</strong>에서 등록하세요
      </p>
    </section>
  </section>
</template>

<style scoped>
.home-screen {
  color: #1f2933;
  display: flex;
  flex-direction: column;
  gap: 28px;
  max-width: 960px;
}

.eyebrow {
  font-size: 0.85rem;
  color: #8a8f98;
  margin: 0;
}

.question {
  font-size: clamp(1.5rem, 2vw, 2.3rem);
  font-weight: 700;
  line-height: 1.35;
  margin: 0;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: clamp(14px, 2vw, 24px);
  margin-top: 12px;
}

.service-card {
  border: none;
  border-radius: 22px;
  background: #ffffff;
  padding: clamp(18px, 2.2vw, 26px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 180px;
  box-shadow: 0 15px 30px rgba(157, 165, 175, 0.2);
  cursor: pointer;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 35px rgba(146, 154, 167, 0.3);
}

.service-copy {
  text-align: left;
}

.service-label {
  font-size: 1.05rem;
  font-weight: 600;
}

.service-desc {
  display: block;
  margin-top: 4px;
  font-size: 0.85rem;
  color: #8a8f98;
}

.service-emoji {
  margin-left: auto;
  margin-top: clamp(12px, 1.5vw, 18px);
  font-size: clamp(3.5rem, 6vw, 5rem);
  line-height: 1;
}

.recommend-area h2 {
  margin: 0 0 12px;
  font-size: 1.2rem;
}

.recommend-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.rec-btn {
  flex: 1;
  padding: 12px;
  border-radius: 14px;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
}

.rec-btn.cafe {
  background: #ffe6e6;
  color: #d9534f;
}

.rec-btn.caf {
  background: #e9f7df;
  color: #4a7c2c;
}

.ranking-board {
  background: #ffffff;
  padding: 20px;
  border-radius: 22px;
  box-shadow: 0 15px 30px rgba(157, 165, 175, 0.15);
}

.rank-title {
  margin-top: 16px;
  margin-bottom: 8px;
  font-weight: 700;
  font-size: 1.05rem;
}

.rank-list {
  list-style: none;
  padding: 0;
  margin: 0 0 12px;
}

.rank-list li {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.rank-list li:last-child {
  border-bottom: none;
}

.rank-empty {
  padding: 12px 0;
  color: #8a8f98;
  font-size: 0.95rem;
}

.promo-board {
  margin-top: 8px;
  border-radius: clamp(26px, 3vw, 36px);
  background: #466122;
  padding: clamp(24px, 3vw, 36px);
  box-shadow: 0 18px 35px rgba(37, 52, 24, 0.35);
  color: #fff5cb;
  font-size: clamp(1rem, 1.4vw, 1.3rem);
  line-height: 1.5;
}

.promo-board .highlight {
  color: #ffb347;
  font-weight: 700;
}

.promo-board strong {
  color: #ffd84e;
  font-weight: 700;
}

@media (max-width: 480px) {
  .service-card {
    min-height: 150px;
  }
}
</style>
