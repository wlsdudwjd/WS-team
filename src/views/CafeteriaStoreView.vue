<script setup lang="ts">
import { useRouter } from 'vue-router'
import { cafeteriaCounters } from './cafeteriaData'

const router = useRouter()

const displayOrder = ['breakfast', 'jjigae', 'korean', 'donkatsu', 'snack', 'ramen-salad'] as const
const counters = displayOrder.map((slug) => {
  const data = cafeteriaCounters[slug]
  return {
    slug,
    title: data?.title ?? '',
    subtitle: data?.subtitle ?? '',
    status: data?.status ?? '',
    icon: data?.icon ?? '🍽️',
  }
})

const handleCounterClick = (counter: (typeof counters)[number]) => {
  router.push(`/cafeteria/huseng/${counter.slug}`)
}
</script>

<template>
  <section class="cafeteria-store">
    <header class="store-toolbar">
      <button class="icon-button" aria-label="뒤로 가기" @click="router.back()">
        <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
          <path d="M15 4 7 12l8 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </button>

      <div class="toolbar-icons">
        <button class="icon-button" aria-label="교환권">
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path
              d="M5 8h14v3a1.5 1.5 0 0 1 0 3v3H5v-3a1.5 1.5 0 0 1 0-3z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path d="M12 8v8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          </svg>
        </button>

        <button class="icon-button" aria-label="주문 내역">
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path
              d="M8 4h8a2 2 0 0 1 2 2v14l-4-2-4 2-4-2V6a2 2 0 0 1 2-2z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linejoin="round"
            />
            <path d="M9 9h6M9 12h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </header>

    <div class="store-hero">
      <p class="eyebrow">전북대 후생관 식당</p>
      <h1>코너를 선택해주세요!</h1>
    </div>

    <ul class="counter-list">
      <li v-for="counter in counters" :key="counter.slug">
        <button type="button" class="counter-card" @click="handleCounterClick(counter)">
          <div class="counter-left">
            <span class="counter-icon">{{ counter.icon }}</span>
            <div class="counter-copy">
              <span class="counter-title">{{ counter.title }}</span>
              <span class="counter-subtitle">{{ counter.subtitle }}</span>
            </div>
          </div>

          <div class="counter-right">
            <span class="status-pill">{{ counter.status }}</span>
            <svg viewBox="0 0 20 20" role="img" aria-label="메뉴 보기">
              <path d="m7 5 6 5-6 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            </svg>
          </div>
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.cafeteria-store {
  max-width: 960px;
  display: flex;
  flex-direction: column;
  gap: clamp(24px, 4vw, 40px);
  padding-bottom: 80px;
}

.store-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar-icons {
  display: flex;
  gap: 12px;
}

.icon-button {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  border: none;
  background: #fff;
  box-shadow: 0 10px 20px rgba(99, 110, 123, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1f2933;
  padding: 0;
}

.icon-button svg {
  width: 24px;
  height: 24px;
}

.store-hero {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.eyebrow {
  margin: 0;
  color: #8a8f98;
  font-size: 0.92rem;
}

.store-hero h1 {
  margin: 0;
  font-size: clamp(1.6rem, 2.8vw, 2.4rem);
  color: #111827;
}

.counter-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.counter-card {
  width: 100%;
  border: none;
  background: #ffffff;
  border-radius: 30px;
  padding: clamp(16px, 2vw, 22px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  box-shadow: 0 18px 35px rgba(84, 97, 119, 0.13);
  cursor: pointer;
  text-align: left;
}

.counter-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.counter-icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: #f5f7fb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.7rem;
}

.counter-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.counter-title {
  font-size: 1rem;
  color: #1f2933;
  font-weight: 600;
}

.counter-subtitle {
  font-size: 0.9rem;
  color: #b1bac4;
}

.counter-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.counter-right svg {
  width: 20px;
  height: 20px;
  color: #9ca3af;
}

.status-pill {
  background: #d1fadf;
  color: #15803d;
  font-size: 0.85rem;
  padding: 6px 12px;
  border-radius: 999px;
}

@media (max-width: 640px) {
  .counter-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .counter-right {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
