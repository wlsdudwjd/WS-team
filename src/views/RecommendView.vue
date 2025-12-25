<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { apiGet, apiPost, type ApiError } from '@/utils/api'

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
  totalLikes: number // 서버가 내려주는 내 추천 누적 횟수(사용자별)
}

type RecommendItem = {
  menuId: number
  menuName: string
  sourceName: string
  kind: MenuKind
}

type MenuPageResponse = {
  content: MenuResponse[]
  totalPages: number
  totalElements?: number
  number?: number
  size?: number
}

const route = useRoute()

const currentFilter = ref<Filter>('all')
const menus = ref<RecommendItem[]>([])
const likeStatuses = ref<Record<number, MenuLikeStatus>>({})
const myLikeCounts = ref<Record<number, number>>({})
const loading = ref(false)
const error = ref<string | null>(null)

const filters = reactive({
  serviceTypeId: '', // 탭으로 설정
  q: '', // 메뉴 이름 검색
})

const pagination = reactive({
  page: 0,
  size: 10, // 고정
  totalPages: 0,
  totalElements: 0,
})

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

const setTabFilter = (filter: Filter) => {
  currentFilter.value = filter
  if (filter === 'cafeteria') {
    filters.serviceTypeId = '2' // 학식
  } else if (filter === 'cafe') {
    filters.serviceTypeId = '1' // 카페
  } else {
    filters.serviceTypeId = ''
  }
  pagination.page = 0
}

const applyRouteFilter = () => {
  const raw = route.params.filter as string | undefined
  if (raw === 'cafeteria' || raw === 'cafe' || raw === 'all') {
    setTabFilter(raw)
  } else {
    setTabFilter('all')
  }
}

applyRouteFilter()

watch(
  () => route.params.filter,
  () => {
    applyRouteFilter()
    refreshData()
  },
)

const buildQueryParams = () => {
  const params = new URLSearchParams()
  if (filters.serviceTypeId.trim()) params.append('serviceTypeId', filters.serviceTypeId.trim())
  if (filters.q.trim()) params.append('q', filters.q.trim())
  params.append('page', String(pagination.page))
  params.append('size', String(pagination.size || 10))
  return params.toString()
}

const fetchMenus = async () => {
  const query = buildQueryParams()
  const data = await apiGet<MenuPageResponse>(`/api/menus?${query}`)

  menus.value = (data.content ?? []).map((menu) => {
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

  pagination.totalPages = data.totalPages ?? (menus.value.length ? 1 : 0)
  pagination.totalElements = data.totalElements ?? menus.value.length
  pagination.page = data.number ?? pagination.page
  pagination.size = data.size ?? pagination.size
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

  // 서버가 내려준 “내가 누른 횟수”를 개인 카운트로 반영
  myLikeCounts.value = data.reduce<Record<number, number>>((acc, row) => {
    acc[row.menuId] = row.totalLikes ?? 0
    return acc
  }, {})
  persistMyLikeCounts()
}

const refreshData = async () => {
  loading.value = true
  error.value = null
  try {
    await fetchMenus()
    await fetchLikeStatuses()
  } catch (err) {
    console.error(err)
    const apiErr = err as ApiError
    error.value = apiErr?.userMessage || '추천 메뉴를 불러오지 못했습니다.'
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
      totalLikes: likeStatuses.value[item.menuId]?.totalLikes ?? 0, // 전역 총합(참고용)
    }
  } catch (err) {
    console.error(err)
    error.value = '추천 반영에 실패했습니다.'
  }
}

const handleFilterSubmit = () => {
  pagination.page = 0
  refreshData()
}

const goToPage = (page: number) => {
  const maxPageIndex = pagination.totalPages ? pagination.totalPages - 1 : 0
  if (page < 0 || page > maxPageIndex) return
  pagination.page = page
  refreshData()
}

const nextPage = () => {
  if (pagination.totalPages && pagination.page >= pagination.totalPages - 1) return
  goToPage(pagination.page + 1)
}

const prevPage = () => {
  if (pagination.page <= 0) return
  goToPage(pagination.page - 1)
}
</script>

<template>
  <section class="recommend-page">
    <header class="header">
      <h1>메뉴 추천하기</h1>
      <p class="sub">학식 · 카페 메뉴 중 마음에 드는 메뉴에 좋아요를 눌러 주세요. 홈 화면에서 인기 메뉴 순위를 보여줍니다.</p>
    </header>

    <div class="tabs">
      <button
        class="tab"
        :class="{ active: currentFilter === 'all' }"
        @click="setTabFilter('all'); refreshData()"
      >
        전체
      </button>
      <button
        class="tab"
        :class="{ active: currentFilter === 'cafeteria' }"
        @click="setTabFilter('cafeteria'); refreshData()"
      >
        학식
      </button>
      <button
        class="tab"
        :class="{ active: currentFilter === 'cafe' }"
        @click="setTabFilter('cafe'); refreshData()"
      >
        카페
      </button>
    </div>

    <form class="filters" @submit.prevent="handleFilterSubmit">
      <div class="filter-row">
        <label>
          검색
          <input
            v-model="filters.q"
            type="text"
            placeholder="메뉴 이름 검색"
            @keyup.enter="handleFilterSubmit"
          />
        </label>
        <button class="apply-btn" type="submit" :disabled="loading">
          검색
        </button>
      </div>
    </form>

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

    <div v-if="!loading" class="pagination">
      <button type="button" class="page-btn" :disabled="pagination.page <= 0" @click="prevPage">
        이전
      </button>
      <span class="page-info">
        {{ pagination.totalPages ? pagination.page + 1 : 0 }} / {{ pagination.totalPages }}
      </span>
      <button
        type="button"
        class="page-btn"
        :disabled="pagination.totalPages <= 1 || pagination.page >= pagination.totalPages - 1"
        @click="nextPage"
      >
        다음
      </button>
    </div>
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

.filters {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 8px 18px rgba(84, 97, 119, 0.08);
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  align-items: end;
}

.filter-row label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #6b7280;
}

.filter-row input,
.filter-row select {
  width: 100%;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  font-size: 13px;
}

.apply-btn {
  justify-self: flex-start;
  padding: 10px 14px;
  border: none;
  border-radius: 10px;
  background: #ff4e5c;
  color: #fff;
  cursor: pointer;
  font-weight: 600;
}

.apply-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.pagination {
  display: flex;
  align-items: center;
  gap: 12px;
  align-self: flex-end;
  font-size: 13px;
}

.page-btn {
  border: 1px solid #e5e7eb;
  background: #fff;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #6b7280;
}
</style>
