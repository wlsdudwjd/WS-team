<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { cafeteriaCounters } from './cafeteriaData'
import { cafeCategories, cafeStores } from './cafeData'
import { useLikeStore, type MenuKind } from '@/stores/likestore'

// 스토어
const likeStore = useLikeStore()
const route = useRoute()

// 탭: 전체 / 학식 / 카페
type Filter = 'all' | 'cafeteria' | 'cafe'
const currentFilter = ref<Filter>('all')

// ▶ URL 파라미터(filter)에 따라 초기 탭 세팅
const applyRouteFilter = () => {
  const raw = route.params.filter as string | undefined
  if (raw === 'cafeteria' || raw === 'cafe' || raw === 'all') {
    currentFilter.value = raw
  } else {
    currentFilter.value = 'all'
  }
}

// 첫 진입 시 1번 적용
applyRouteFilter()

// 주소 바뀌면 다시 적용 (예: /recommend → /recommend/cafe)
watch(
  () => route.params.filter,
  () => applyRouteFilter()
)

// 학식 메뉴 평탄화
const cafeteriaMenus = computed(() => {
  const result: {
    kind: MenuKind
    menuSlug: string
    menuName: string
    sourceName: string
  }[] = []

  for (const counter of Object.values(cafeteriaCounters)) {
    for (const menu of counter.menus) {
      result.push({
        kind: 'cafeteria',
        menuSlug: `cafeteria-${menu.slug}`,
        menuName: menu.name,
        sourceName: counter.title,
      })
    }
  }

  return result
})

// 카페 메뉴 평탄화
const cafeMenus = computed(() => {
  const storeName =
    cafeStores.find((s) => s.id === 'hus')?.name ?? '쿱카페'

  const result: {
    kind: MenuKind
    menuSlug: string
    menuName: string
    sourceName: string
  }[] = []

  for (const category of cafeCategories) {
    for (const menu of category.menus) {
      result.push({
        kind: 'cafe',
        menuSlug: `cafe-${menu.slug}`,
        menuName: menu.name,
        sourceName: `${storeName} · ${category.title}`,
      })
    }
  }

  return result
})

const allMenus = computed(() => [...cafeteriaMenus.value, ...cafeMenus.value])

const filteredMenus = computed(() => {
  if (currentFilter.value === 'cafeteria') {
    return cafeteriaMenus.value
  }
  if (currentFilter.value === 'cafe') {
    return cafeMenus.value
  }
  return allMenus.value
})

const getLikeCount = (kind: MenuKind, menuSlug: string) => {
  const key = `${kind}:${menuSlug}`
  return likeStore.items[key]?.likes ?? 0
}

const handleLike = (item: {
  kind: MenuKind
  menuSlug: string
  menuName: string
  sourceName: string
}) => {
  likeStore.like(item)
}
</script>

<template>
  <section class="recommend-page">
    <header class="header">
      <h1>메뉴 추천하기</h1>
      <p class="sub">
        학식 · 카페 메뉴 중 마음에 드는 메뉴에 좋아요를 눌러 주세요.
        홈 화면에서 인기 메뉴 순위를 보여줍니다.
      </p>
    </header>

    <!-- 필터 탭 -->
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

    <!-- 메뉴 리스트 -->
    <ul class="menu-list">
      <li
        v-for="item in filteredMenus"
        :key="item.menuSlug"
        class="menu-row"
      >
        <div class="menu-info">
          <p class="menu-name">{{ item.menuName }}</p>
          <p class="menu-source">{{ item.sourceName }}</p>
        </div>

        <button class="like-btn" @click="handleLike(item)">
          <span class="heart">♥</span>
          <span class="count">
            {{ getLikeCount(item.kind, item.menuSlug) }}
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
