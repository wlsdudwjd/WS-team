<script setup lang="ts">
import { useRouter } from 'vue-router'
import { cafeStores } from './cafeData'

const router = useRouter()

const recentStores = cafeStores.slice(0, 2)
const stores = cafeStores

const goToStore = (id: string) => {
  router.push(`/cafe/${id}`)
}
</script>

<template>
  <section class="cafe-page">
    <header class="cafe-toolbar">
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

    <section aria-labelledby="recent-heading" class="recent-section">
      <h2 id="recent-heading">최근 주문한 매장</h2>

      <div class="recent-grid">
        <article v-for="store in recentStores" :key="store.id" class="recent-card" @click="goToStore(store.id)">
          <div class="cafe-icon" aria-hidden="true">
            <span>☕️</span>
          </div>
          <div class="store-copy">
            <h3>{{ store.name }}</h3>
            <p>{{ store.subtitle }}</p>
          </div>
        </article>
      </div>
    </section>

    <section aria-labelledby="all-heading" class="all-section">
      <h2 id="all-heading">모든 매장</h2>

      <ul class="store-list">
        <li v-for="store in stores" :key="store.id" class="store-row" @click="goToStore(store.id)">
          <div class="store-left">
            <div class="cafe-icon small" aria-hidden="true">
              <span>☕️</span>
            </div>
            <div class="store-copy">
              <h3>{{ store.name }}</h3>
              <p>{{ store.subtitle }}</p>
            </div>
          </div>

          <div class="tag-group">
            <span>매장</span>
            <span>테이크아웃</span>
          </div>
        </li>
      </ul>
    </section>
  </section>
</template>

<style scoped>
.cafe-page {
  max-width: 960px;
  display: flex;
  flex-direction: column;
  gap: clamp(24px, 3vw, 40px);
}

.cafe-toolbar {
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
}

.recent-section,
.all-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.recent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.recent-card {
  background: #ffffff;
  border-radius: 30px;
  padding: 18px;
  box-shadow: 0 18px 35px rgba(84, 97, 119, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.cafe-icon {
  width: 110px;
  height: 110px;
  border-radius: 24px;
  background: #7c8498;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
}

.cafe-icon.small {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  font-size: 1.2rem;
}

.store-copy h3 {
  margin: 0;
  font-size: 1rem;
  color: #111827;
}

.store-copy p {
  margin: 4px 0 0;
  color: #9ba4b0;
  font-size: 0.85rem;
}

.store-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.store-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 12px 24px rgba(84, 97, 119, 0.12);
}

.store-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tag-group {
  display: flex;
  gap: 8px;
}

.tag-group span {
  padding: 6px 12px;
  border-radius: 999px;
  background: #eef2ff;
  color: #6570a7;
  font-size: 0.8rem;
}
</style>
