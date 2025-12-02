<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { cafeteriaCounters, type CafeteriaMenu, type CafeteriaSlug } from './cafeteriaData'

const router = useRouter()
const route = useRoute()

const currentSlug = computed(() => route.params.slug as CafeteriaSlug)
const currentCounter = computed(() => cafeteriaCounters[currentSlug.value])

const handleMenuClick = (menu: CafeteriaMenu) => {
  router.push({ name: 'cafeteria-order', params: { slug: currentSlug.value, menu: menu.slug } })
}
</script>

<template>
  <section class="counter-page">
    <header class="counter-toolbar">
      <button class="icon-button" aria-label="뒤로 가기" @click="router.back()">
        <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
          <path d="M15 4 7 12l8 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </button>
    </header>

    <template v-if="currentCounter">
      <div class="counter-hero">
        <span class="counter-icon">{{ currentCounter.icon }}</span>
        <div>
          <p class="eyebrow">전북대 후생관 식당</p>
          <h1>{{ currentCounter.title }}</h1>
          <p class="subtitle">{{ currentCounter.subtitle }}</p>
        </div>
      </div>

      <ul class="menu-list">
        <li v-for="menu in currentCounter.menus" :key="menu.slug">
          <button type="button" class="menu-card" @click="handleMenuClick(menu)">
            <div>
              <h3>{{ menu.name }}</h3>
              <p>{{ menu.description }}</p>
            </div>
            <div class="menu-meta">
              <span class="price">{{ menu.price.toLocaleString() }}원</span>
              <svg viewBox="0 0 20 20" role="img" aria-label="주문하기">
                <path d="m7 5 6 5-6 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
              </svg>
            </div>
          </button>
        </li>
      </ul>
    </template>

    <div v-else class="empty-state">
      <p>선택한 코너 정보를 찾을 수 없습니다.</p>
      <button class="icon-button" @click="router.push('/cafeteria/huseng')">목록으로 돌아가기</button>
    </div>
  </section>
</template>

<style scoped>
.counter-page {
  max-width: 960px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.counter-toolbar {
  display: flex;
  justify-content: flex-start;
}

.icon-button {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: none;
  background: #fff;
  box-shadow: 0 10px 20px rgba(99, 110, 123, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.counter-hero {
  display: flex;
  gap: 16px;
  align-items: center;
  background: #fff;
  border-radius: 24px;
  padding: 20px;
  box-shadow: 0 18px 35px rgba(84, 97, 119, 0.13);
}

.counter-icon {
  width: 60px;
  height: 60px;
  border-radius: 18px;
  background: #f5f7fb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.eyebrow {
  margin: 0;
  color: #8a8f98;
  font-size: 0.9rem;
}

.subtitle {
  margin: 4px 0 0;
  color: #9ba4b0;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.menu-card {
  width: 100%;
  border: none;
  border-radius: 22px;
  background: #ffffff;
  padding: 18px;
  box-shadow: 0 12px 28px rgba(84, 97, 119, 0.12);
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  cursor: pointer;
}

.menu-card h3 {
  margin: 0 0 6px;
  font-size: 1.05rem;
}

.menu-card p {
  margin: 0;
  color: #9ba4b0;
  font-size: 0.9rem;
}

.menu-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #9ca3af;
}

.price {
  font-weight: 600;
  color: #1f2933;
}

.empty-state {
  text-align: center;
  color: #6b7280;
}
</style>
