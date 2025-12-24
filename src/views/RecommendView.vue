<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { apiGet, apiPost } from '@/utils/api'

type MenuKind = 'cafeteria' | 'cafe'
type Filter = 'all' | 'cafeteria' | 'cafe'

type MenuResponse = {
  menuId: number
  name: string
  price: number
  description?: string
  store?: {
    storeId: number
    name: string
    serviceType?: {
      serviceTypeId: number
      name: string
    }
  }
}

type MenuLikeStatus = {
  menuId: number
  liked: boolean
  totalLikes: number
}

type RecommendItem = {
  menuId: number
  menuName: string
  sourceName: string
  kind: MenuKind
}

const route = useRoute()

const currentFilter = ref<Filter>('all')
const menus = ref<RecommendItem[]>([])
const likeStatuses = ref<Record<number, MenuLikeStatus>>({})
const myLikeCounts = ref<Record<number, number>>({})
const loading = ref(false)
const error = ref<string | null>(null)

const ensureUserEmail = () => {
  const stored = localStorage.getItem('ws_user_email')
  if (stored) return stored
  const fallback = `guest-${Date.now()}@example.com`
  localStorage.setItem('ws_user_email', fallback)
  return fallback
}
const userEmail = ref(ensureUserEmail())
const myLikesStorageKey = computed(() => `ws_my_likes_${userEmail.value}`)

const loadMyLikeCounts = () => {
  try {
    const raw = localStorage.getItem(myLikesStorageKey.value)
    if (!raw) return
    const parsed = JSON.parse(raw) as Record<number, number>
    myLikeCounts.value = parsed
  } catch (err) {
    console.error('내 좋아요 카운트 로드 실패', err)
  }
}

const persistMyLikeCounts = () => {
  try {
    localStorage.setItem(myLikesStorageKey.value, JSON.stringify(myLikeCounts.value))
  } catch (err) {
    console.error('내 좋아요 카운트 저장 실패', err)
  }
}

const applyRouteFilter = () => {
  const raw = route.params.filter as string | undefined
  if (raw === 'cafeteria' || raw === 'cafe' || raw === 'all') {
    currentFilter.value = raw
  } else {
    currentFilter.value = 'all'
  }
}

applyRouteFilter()

watch(
  () => route.params.filter,
  () => applyRouteFilter(),
)

const fetchMenus = async () => {
  const data = await apiGet<MenuResponse[]>('/api/menus')

  menus.value = data.map((menu) => {
    const serviceName = menu.store?.serviceType?.name?.toLowerCase() ?? ''
    const serviceTypeId = menu.store?.serviceType?.serviceTypeId
    const kind: MenuKind =
      serviceTypeId === 2 || serviceName.includes('cafeteria')
        ? 'cafeteria'
        : 'cafe'

    return {
      menuId: menu.menuId,
      menuName: menu.name,
      sourceName: menu.store?.name ?? '',
      kind,
    }
  })
}

const fetchLikeStatuses = async () => {
  if (!menus.value.length) return
  const ids = menus.value.map((m) => m.menuId).join(',')
  const data = await apiGet<MenuLikeStatus[]>(
    `/api/menu-likes/status?userEmail=${encodeURIComponent(userEmail.value)}&menuIds=${ids}`,
  )
  likeStatuses.value = data.reduce<Record<number, MenuLikeStatus>>((acc, row) => {
    acc[row.menuId] = row
    return acc
  }, {})
}

const refreshData = async () => {
  loading.value = true
  error.value = null
  try {
    await fetchMenus()
    await fetchLikeStatuses()
  } catch (err) {
    console.error(err)
    error.value = '추천 메뉴를 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
}

onMounted(refreshData)
onMounted(loadMyLikeCounts)

const filteredMenus = computed(() => {
  if (currentFilter.value === 'cafeteria') {
    return menus.value.filter((m) => m.kind === 'cafeteria')
  }
  if (currentFilter.value === 'cafe') {
    return menus.value.filter((m) => m.kind === 'cafe')
  }
  return menus.value
})

// 추천하기 탭은 사용자별 상태를 보여주므로 내 누적 횟수만 표시
const getMyLikeCount = (menuId: number) => myLikeCounts.value[menuId] ?? 0

const handleLike = async (item: RecommendItem) => {
  try {
    await apiPost('/api/menu-likes', {
      userEmail: userEmail.value,
      menuId: item.menuId,
    })
    myLikeCounts.value[item.menuId] = (myLikeCounts.value[item.menuId] ?? 0) + 1
    persistMyLikeCounts()
    likeStatuses.value[item.menuId] = {
      menuId: item.menuId,
      liked: true,
      totalLikes: (likeStatuses.value[item.menuId]?.totalLikes ?? 0) + 1, // 전역 총합(참고용)
    }
  } catch (err) {
    console.error(err)
    error.value = '추천 반영에 실패했습니다.'
  }
}
</script>

<template>
  <section class="recommend-page">
    <header class="header">
      <h1>메뉴 추천하기</h1>
      <p class="sub">학식 · 카페 메뉴 중 마음에 드는 메뉴에 좋아요를 눌러 주세요. 홈 화면에서 인기 메뉴 순위를 보여줍니다.</p>
    </header>

    <!-- 탭 -->
    <div class="tabs">
      <button
        class="tab"
        :class="{ active: currentFilter === 'all' }"
        @click="currentFilter = 'all'"
      >
        전체
      </button>
      <button
        class="tab"
        :class="{ active: currentFilter === 'cafeteria' }"
        @click="currentFilter = 'cafeteria'"
      >
        학식
      </button>
      <button
        class="tab"
        :class="{ active: currentFilter === 'cafe' }"
        @click="currentFilter = 'cafe'"
      >
        카페
      </button>
    </div>

    <div v-if="loading" class="sub">불러오는 중...</div>
    <div v-else-if="error" class="sub error">{{ error }}</div>
    <ul v-else class="menu-list">
      <li v-for="item in filteredMenus" :key="item.menuId" class="menu-row">
        <div class="menu-info">
          <p class="menu-name">{{ item.menuName }}</p>
          <p class="menu-source">{{ item.sourceName }}</p>
        </div>

        <button class="like-btn" @click="handleLike(item)">
          <span class="heart">👍</span>
          <span class="count">
            {{ getMyLikeCount(item.menuId) }}
          </span>
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.recommend-page {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.header h1 {
  margin: 0 0 4px;
  font-size: 20px;
}

.sub {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}
.sub.error {
  color: #ef4444;
}

.tabs {
  display: flex;
  gap: 8px;
}

.tab {
  padding: 6px 12px;
  border-radius: 999px;
  border: none;
  background: #f3f4f6;
  font-size: 13px;
  cursor: pointer;
}

.tab.active {
  background: #ff4e5c;
  color: #fff;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 12px 24px rgba(84, 97, 119, 0.12);
}

.menu-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.menu-name {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.menu-source {
  margin: 0;
  font-size: 11px;
  color: #9ca3af;
}

.like-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;
  border-radius: 999px;
  padding: 6px 10px;
  background: #fff5f5;
  color: #f97373;
  cursor: pointer;
  font-size: 13px;
}

.heart {
  font-size: 14px;
}

.count {
  min-width: 18px;
  text-align: right;
}
</style>
