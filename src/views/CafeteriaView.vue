<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const recentStore = {
  name: '전북대 후생관 식당',
  subtitle: '후생관',
  status: '최근 주문',
}

const stores = [
  { id: 1, name: '전북대 후생관 식당', subtitle: '후생관', status: '매장식사', theme: 'primary', link: '/cafeteria/huseng' },
  { id: 2, name: '진수원 식당', subtitle: '진수당 2층', status: '준비 중', theme: 'secondary' },
]

const handleStoreClick = (store: (typeof stores)[number]) => {
  if (store.link) {
    router.push(store.link)
  }
}
</script>

<template>
  <section class="cafeteria-page">
    <header class="cafeteria-toolbar">
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

      <article class="recent-card">
        <div class="store-icon large" aria-hidden="true">🍽️</div>
        <div class="store-copy">
          <h3>{{ recentStore.name }}</h3>
          <p>{{ recentStore.subtitle }}</p>
        </div>
      </article>
    </section>

    <section aria-labelledby="all-heading" class="all-section">
      <h2 id="all-heading">모든 매장</h2>

      <ul class="store-list">
        <li v-for="store in stores" :key="store.id">
          <button type="button" class="store-row" @click="handleStoreClick(store)">
            <div class="store-left">
              <div class="store-icon" :data-theme="store.theme" aria-hidden="true">🍽️</div>
              <div class="store-copy">
                <h3>{{ store.name }}</h3>
                <p>{{ store.subtitle }}</p>
              </div>
            </div>

            <span class="store-badge">{{ store.status }}</span>
          </button>
        </li>
      </ul>
    </section>
  </section>
</template>

<style scoped>
.cafeteria-page {
  display: flex;
  flex-direction: column;
  gap: clamp(24px, 3vw, 40px);
  max-width: 960px;
  padding-bottom: 40px;
}

.cafeteria-toolbar {
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

.recent-section h2,
.all-section h2 {
  margin: 0 0 16px;
  font-size: 1.1rem;
  color: #111827;
}

.recent-card {
  display: flex;
  align-items: center;
  gap: 18px;
}

.store-icon {
  width: 72px;
  height: 72px;
  border-radius: 24px;
  background: #7286d3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
}

.store-icon.large {
  width: clamp(120px, 20vw, 160px);
  height: clamp(120px, 20vw, 160px);
  border-radius: 40px;
  font-size: clamp(3rem, 6vw, 4.5rem);
}

.store-icon[data-theme='secondary'] {
  background: #1d2a49;
}

.store-copy h3 {
  margin: 0;
  font-size: 1.05rem;
  color: #111827;
}

.store-copy p {
  margin: 4px 0 0;
  color: #9ba4b0;
  font-size: 0.9rem;
}

.store-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.store-row {
  width: 100%;
  border: none;
  background: transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  cursor: pointer;
  text-align: left;
}

.store-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.store-badge {
  padding: 8px 12px;
  border-radius: 999px;
  background: #eef2ff;
  color: #6570a7;
  font-size: 0.85rem;
  white-space: nowrap;
}

@media (max-width: 600px) {
  .store-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .store-badge {
    margin-left: 88px;
  }
}
</style>
