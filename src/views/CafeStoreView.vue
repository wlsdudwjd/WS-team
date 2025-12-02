<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  cafeStores,
  cafeCategories,
  type CafeCategory,
  type CafeMenu,
} from './cafeData'

const route = useRoute()
const router = useRouter()

// 라우터에서 :id / :storeId 둘 중 무엇을 쓰더라도 대응
const storeId = computed(
  () => (route.params.id ?? route.params.storeId) as string,
)

const store = computed(() =>
  cafeStores.find((s) => s.id === storeId.value),
)

// 선택된 카테고리 key
const selectedKey = ref<string>(cafeCategories[0]?.key ?? 'coffee')

const selectedCategory = computed<CafeCategory | undefined>(() =>
  cafeCategories.find((c) => c.key === selectedKey.value),
)

const menus = computed<CafeMenu[]>(() => selectedCategory.value?.menus ?? [])

const formatPrice = (price: number) => price.toLocaleString('ko-KR')

const goBack = () => {
  router.back()
}

const goToOrder = (menu: CafeMenu) => {
  // /cafe/:id/menu/:slug 라우트로 이동
  router.push({
    name: 'cafe-order',
    params: {
      id: storeId.value,
      slug: menu.slug,
    },
  })
}
</script>

<template>
  <!-- 매장을 정상적으로 찾은 경우 -->
  <section v-if="store" class="store-page">
    <!-- 상단 헤더 (학식당 UI와 유사) -->
    <header class="store-header">
      <button class="back-btn" aria-label="뒤로가기" @click="goBack">
        ‹
      </button>
      <div class="store-info">
        <p class="store-label">CAFE</p>
        <h1 class="store-name">{{ store.name }}</h1>
        <p class="store-sub">{{ store.subtitle }}</p>
      </div>
    </header>

    <!-- 카테고리 탭 -->
    <div class="category-tabs">
      <button
        v-for="category in cafeCategories"
        :key="category.key"
        class="category-tab"
        :class="{ active: selectedKey === category.key }"
        @click="selectedKey = category.key"
      >
        <span class="emoji">{{ category.title.split(' ')[0] }}</span>
        <span>{{ category.title.replace(/^[^ ]+\s*/, '') }}</span>
      </button>
    </div>

    <!-- 메뉴 리스트 -->
    <section class="menu-section" v-if="selectedCategory">
      <h2 class="section-title">{{ selectedCategory.title }}</h2>

      <ul class="menu-list">
        <li
          v-for="menu in menus"
          :key="menu.slug"
          class="menu-item"
          @click="goToOrder(menu)"
        >
          <div class="menu-left">
            <p class="menu-name">{{ menu.name }}</p>
            <p class="menu-desc">매장에서 바로 추출한 메뉴</p>
          </div>

          <div class="menu-right">
            <p class="menu-price">
              {{ formatPrice(menu.price) }}
              <span class="unit">원</span>
            </p>
            <span class="menu-arrow">›</span>
          </div>
        </li>
      </ul>
    </section>
  </section>

  <!-- 매장을 못 찾았을 때 (지금처럼 빈 화면 대신 이게 보이도록) -->
  <section v-else class="store-page">
    <header class="store-header">
      <button class="back-btn" aria-label="뒤로가기" @click="goBack">
        ‹
      </button>
      <div class="store-info">
        <p class="store-label">CAFE</p>
        <h1 class="store-name">매장을 찾을 수 없습니다</h1>
        <p class="store-sub">주소 또는 라우터 설정을 확인해 주세요.</p>
      </div>
    </header>
  </section>
</template>

<style scoped>
.store-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 헤더 */
.store-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.back-btn {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: none;
  background: #ffffff;
  box-shadow: 0 8px 18px rgba(84, 97, 119, 0.15);
  font-size: 20px;
}

.store-info .store-label {
  font-size: 11px;
  color: #999;
  margin: 0 0 4px;
}

.store-info .store-name {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.store-info .store-sub {
  font-size: 12px;
  color: #9ba4b0;
  margin: 4px 0 0;
}

/* 카테고리 탭 */
.category-tabs {
  display: flex;
  overflow-x: auto;
  gap: 8px;
  padding: 8px 0;
}

.category-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  border: none;
  background: #f4f4f7;
  font-size: 12px;
  white-space: nowrap;
}

.category-tab.active {
  background: #ff8a80;
  color: #fff;
}

.emoji {
  font-size: 14px;
}

/* 메뉴 리스트 */
.menu-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-title {
  font-size: 14px;
  font-weight: 700;
  color: #555;
  margin: 0 0 4px;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-radius: 22px;
  background: #ffffff;
  box-shadow: 0 12px 24px rgba(84, 97, 119, 0.12);
  cursor: pointer;
}

.menu-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-name {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}

.menu-desc {
  margin: 0;
  font-size: 12px;
  color: #9ba4b0;
}

.menu-right {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.menu-price {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.unit {
  font-size: 11px;
  margin-left: 2px;
  color: #777;
}

.menu-arrow {
  font-size: 18px;
  color: #ccc;
}
</style>
