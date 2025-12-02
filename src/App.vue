<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()
const showCardModal = ref(false)
const modalTabs = ['카드', '멤버십', '캠퍼스페이', '팀'] as const
const activeModalTab = ref<(typeof modalTabs)[number]>('카드')

const navItems = [
  { id: 'home', label: '홈', icon: 'home', to: '/home', match: '/home' },
  { id: 'coupon', label: '교환권/쿠폰', icon: 'ticket', to: '/coupons', match: '/coupons' },
  { id: 'history', label: '주문 내역', icon: 'receipt', to: '/orders', match: '/orders' },
  { id: 'more', label: '더보기', icon: 'more', to: '/mypage', match: '/mypage' }
]

const isItemActive = (item: (typeof navItems)[number]) => {
  if (item.match === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(item.match)
}

const showNav = computed(() => route.name !== 'login')

const openCardModal = () => {
  activeModalTab.value = '카드'
  showCardModal.value = true
}

const closeCardModal = () => {
  showCardModal.value = false
}
</script>

<template>
  <div class="app-shell">
    <div class="screen">
      <header class="app-header">
        <div class="logo-pill">WS</div>
        <RouterLink class="icon-button" aria-label="알림" :to="{ name: 'notifications' }">
          <svg class="bell-icon" viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path
              d="M12 3a5 5 0 0 0-5 5v3.38c0 .53-.21 1.03-.58 1.41l-.96 1 0 0c-.84.87-.25 2.2.94 2.2h12.78c1.19 0 1.78-1.33.94-2.2l-.01-.01-.96-1a2 2 0 0 1-.58-1.41V8a5 5 0 0 0-5-5z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M14.5 19a2.5 2.5 0 0 1-5 0"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            />
          </svg>
        </RouterLink>
      </header>

      <main class="page">
        <RouterView />
      </main>
    </div>

    <nav v-if="showNav" class="bottom-nav" aria-label="하단 메뉴">
      <ul>
        <li v-for="item in navItems" :key="item.id" :class="{ active: isItemActive(item) }">
          <RouterLink :to="item.to" class="nav-link">
            <span class="nav-icon" aria-hidden="true">
              <svg
                v-if="item.icon === 'home'"
                viewBox="0 0 24 24"
                role="img"
                aria-hidden="true"
              >
                <path
                  d="M3.5 11 12 4l8.5 7v8.5a1.5 1.5 0 0 1-1.5 1.5h-4.5v-5h-5v5H5a1.5 1.5 0 0 1-1.5-1.5z"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linejoin="round"
                />
              </svg>
              <svg
                v-else-if="item.icon === 'ticket'"
                viewBox="0 0 24 24"
                role="img"
                aria-hidden="true"
              >
                <path
                  d="M4 7.5h16v3a1.5 1.5 0 0 1 0 3v3H4v-3a1.5 1.5 0 0 1 0-3z"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path d="M12 7.5v9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
              </svg>
              <svg
                v-else-if="item.icon === 'receipt'"
                viewBox="0 0 24 24"
                role="img"
                aria-hidden="true"
              >
                <path
                  d="M7 3.5h10a2 2 0 0 1 2 2v15l-3-1.5-3 1.5-3-1.5-3 1.5v-15a2 2 0 0 1 2-2z"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linejoin="round"
                />
                <path d="M9.5 8.5H15m-5.5 3.5H15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
              </svg>
              <svg
                v-else
                viewBox="0 0 24 24"
                role="img"
                aria-hidden="true"
              >
                <circle cx="5" cy="12" r="1.5" fill="currentColor" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                <circle cx="19" cy="12" r="1.5" fill="currentColor" />
              </svg>
            </span>
            <span class="nav-label">{{ item.label }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <button
      v-if="showNav"
      class="floating-action"
      aria-label="카드"
      type="button"
      @click="openCardModal"
    >
      <svg viewBox="0 0 32 32" role="img" aria-hidden="true">
        <rect x="5" y="8" width="22" height="16" rx="4" fill="currentColor" opacity="0.15" />
        <rect
          x="7"
          y="10"
          width="18"
          height="12"
          rx="3"
          fill="none"
          stroke="white"
          stroke-width="1.6"
        />
        <rect x="10" y="15" width="10" height="1.6" rx="0.8" fill="white" />
      </svg>
    </button>

    <div v-if="showCardModal" class="card-modal-overlay" @click.self="closeCardModal">
      <div class="card-sheet">
        <div class="sheet-handle"></div>
        <div class="sheet-tabs">
          <button
            v-for="tab in modalTabs"
            :key="tab"
            class="tab"
            :class="{ active: activeModalTab === tab }"
            type="button"
            @click="activeModalTab = tab"
          >
            {{ tab }}
          </button>
        </div>

        <div class="sheet-body">
          <template v-if="activeModalTab === '카드'">
            <div class="barcode-box">
              <button class="barcode-btn" type="button">󰌇 바코드 생성하기</button>
            </div>

            <div class="hint">
              <span class="arrow">↑</span>
              <p>바코드를 리더기에 인식해주세요</p>
            </div>

            <div class="card-carousel">
              <div class="card-item primary">
                <div class="card-logo">신한카드</div>
                <div class="chip"></div>
                <div class="brand">S</div>
              </div>
              <button class="add-card" type="button">+ 추가</button>
            </div>
          </template>

          <template v-else-if="activeModalTab === '멤버십'">
            <div class="barcode-large">
              <div class="barcode-lines" aria-hidden="true"></div>
              <div class="barcode-text">
                <span>2분 이내로 바코드를 사용해 주세요.</span>
                <span class="timer">1분 50초</span>
              </div>
            </div>

            <div class="hint">
              <span class="arrow">↑</span>
              <p>멤버십 카드를 터치하면 멤버십의 자세한 정보를 볼 수 있어요</p>
            </div>

            <div class="membership-row">
              <button class="add-card ghost" type="button">+ 가입</button>
              <div class="membership-card">
                <div class="membership-text">
                  <p class="name">전북대 조합원 (학생)</p>
                  <p class="points">203P</p>
                </div>
                <div class="membership-badge">JNU</div>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="placeholder-tab">준비 중입니다.</div>
          </template>
        </div>

        <button class="sheet-close" type="button" @click="closeCardModal">닫기</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: linear-gradient(180deg, #ffffff 0%, #f7f8fa 50%, #f8f2ea 100%);
  display: flex;
  justify-content: center;
}

.screen {
  width: min(1100px, 100%);
  min-height: 100vh;
  margin: 0 auto;
  padding: clamp(24px, 4vw, 64px) clamp(16px, 6vw, 96px) clamp(180px, 20vh, 260px);
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.logo-pill {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: linear-gradient(135deg, #ffd4d2, #ff9a9e);
  color: #63151a;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.04em;
}

.icon-button {
  border: none;
  background: #ffffff;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(149, 157, 165, 0.2);
  color: #1f2933;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.icon-button:focus-visible,
.bottom-nav .nav-link:focus-visible,
.floating-action:focus-visible,
.service-card:focus-visible {
  outline: 2px solid #ff5b67;
  outline-offset: 3px;
}

.bell-icon {
  width: 22px;
  height: 22px;
}

.page {
  flex: 1;
}

.bottom-nav {
  position: fixed;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
  width: min(960px, calc(100% - 32px));
  background: #ffffff;
  border-radius: 28px;
  box-shadow: 0 28px 40px rgba(72, 89, 108, 0.15);
  padding: 10px 24px;
  z-index: 10;
}

.bottom-nav ul {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-link {
  border: none;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 4px;
  color: #9ba4b0;
  font-size: 0.78rem;
  text-decoration: none;
}

.bottom-nav li.active .nav-link {
  color: #ff4e5c;
  font-weight: 600;
}

.nav-icon {
  width: 24px;
  height: 24px;
}

.nav-icon svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
}

.floating-action {
  position: fixed;
  left: 50%;
  bottom: 72px;
  transform: translateX(-50%);
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: none;
  background: radial-gradient(circle at 30% 20%, #ff9a9e, #ff4e5c);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 18px 30px rgba(255, 78, 92, 0.5);
  z-index: 11;
}

.floating-action svg {
  width: 32px;
  height: 32px;
}

.card-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.35);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 16px;
  z-index: 100;
}

.card-sheet {
  width: min(960px, 100%);
  background: #ffffff;
  border-radius: 26px;
  box-shadow: 0 -16px 32px rgba(0, 0, 0, 0.08);
  padding: 14px 18px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  animation: slideUp 0.22s ease;
}

.sheet-handle {
  width: 46px;
  height: 4px;
  background: #e5e7eb;
  border-radius: 999px;
  align-self: center;
}

.sheet-tabs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.tab {
  border: none;
  background: none;
  padding: 10px 8px;
  color: #9ca3af;
  font-weight: 700;
  cursor: pointer;
}

.tab.active {
  color: #1f2937;
  position: relative;
}

.tab.active::after {
  content: '';
  position: absolute;
  left: 20%;
  right: 20%;
  bottom: -4px;
  height: 3px;
  border-radius: 999px;
  background: #ff6b6b;
}

.sheet-body {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.barcode-box {
  background: #f7f9fb;
  border-radius: 18px;
  padding: 16px;
  display: flex;
  justify-content: center;
}

.barcode-btn {
  border: none;
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  border-radius: 14px;
  padding: 14px 22px;
  box-shadow: 0 12px 24px rgba(255, 107, 107, 0.28);
  cursor: pointer;
}

.barcode-large {
  background: #f7f9fb;
  border-radius: 18px;
  padding: 18px 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.barcode-lines {
  width: 100%;
  height: 120px;
  border-radius: 12px;
  background: repeating-linear-gradient(
      90deg,
      #111827 0,
      #111827 2px,
      transparent 2px,
      transparent 6px
    ),
    #fff;
  box-shadow: inset 0 0 0 6px #fff;
}

.barcode-text {
  display: flex;
  justify-content: space-between;
  color: #6b7280;
  font-size: 13px;
}

.barcode-text .timer {
  font-weight: 700;
}

.hint {
  text-align: center;
  color: #9ca3af;
  font-size: 13px;
  display: grid;
  gap: 4px;
  justify-content: center;
}

.hint .arrow {
  font-size: 18px;
}

.card-carousel {
  display: flex;
  align-items: center;
  gap: 14px;
  overflow-x: auto;
  padding: 4px;
}

.card-item {
  min-width: 240px;
  height: 140px;
  border-radius: 16px;
  padding: 16px;
  color: #fff;
  position: relative;
  flex-shrink: 0;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.12);
}

.card-item.primary {
  background: linear-gradient(135deg, #0f60c4, #0b4fa2);
}

.card-logo {
  font-size: 18px;
  font-weight: 700;
}

.chip {
  width: 36px;
  height: 24px;
  border-radius: 6px;
  background: linear-gradient(135deg, #f6d365, #fda085);
  margin-top: 20px;
}

.brand {
  position: absolute;
  bottom: 12px;
  right: 14px;
  font-size: 32px;
  opacity: 0.8;
}

.membership-row {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.membership-card {
  flex: 1;
  min-width: 240px;
  border-radius: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #8b2b30, #a53c42);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 12px 22px rgba(139, 43, 48, 0.28);
}

.membership-text {
  display: grid;
  gap: 6px;
}

.membership-text .name {
  margin: 0;
  font-weight: 700;
}

.membership-text .points {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
}

.membership-badge {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f9e9e9;
  color: #8b2b30;
  display: grid;
  place-items: center;
  font-weight: 800;
}

.add-card {
  min-width: 90px;
  height: 120px;
  border-radius: 16px;
  border: 1px dashed #d1d5db;
  background: #f8fafc;
  color: #6b7280;
  font-weight: 700;
  cursor: pointer;
  flex-shrink: 0;
}

.add-card.ghost {
  height: 64px;
  background: #f8fafc;
  border-color: #e5e7eb;
}

.sheet-close {
  align-self: center;
  margin-top: 4px;
  border: none;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
}

@keyframes slideUp {
  from {
    transform: translateY(12px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 480px) {
  .screen {
    padding-bottom: 140px;
  }
}

@media (min-width: 768px) {
  .bottom-nav {
    bottom: 32px;
    padding: 12px 32px;
  }

  .floating-action {
    bottom: 110px;
  }
}

@media (min-width: 1024px) {
  .screen {
    padding-bottom: clamp(200px, 18vh, 260px);
  }

  .bottom-nav {
    bottom: 40px;
    border-radius: 32px;
  }

  .floating-action {
    bottom: 140px;
  }
}
</style>
