<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { id: 'home', label: '홈', icon: 'home', to: '/home', match: '/home' },
  { id: 'coupon', label: '교환권', icon: 'ticket', to: '/coupons', match: '/coupons' },
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
</script>

<template>
  <div class="app-shell">
    <div class="screen">
      <header class="app-header">
        <RouterLink class="logo-pill" :to="{ name: 'home' }" aria-label="홈으로 이동">WS</RouterLink>
        <div class="header-actions">
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
          <RouterLink class="icon-button" aria-label="장바구니" :to="{ name: 'cart' }">
            <svg class="cart-icon" viewBox="0 0 24 24" role="img" aria-hidden="true">
              <path
                d="M6 8h12l-.9 9.1a2 2 0 0 1-2 1.9H8.9a2 2 0 0 1-2-1.9z"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linejoin="round"
              />
              <path
                d="M9 8V6.5A3 3 0 0 1 12 3.5a3 3 0 0 1 3 3.1V8"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
              />
              <circle cx="10" cy="20" r="1.2" fill="currentColor" />
              <circle cx="16" cy="20" r="1.2" fill="currentColor" />
            </svg>
          </RouterLink>
        </div>
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
  text-decoration: none;
}

.header-actions {
  display: flex;
  gap: 12px;
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
.service-card:focus-visible {
  outline: 2px solid #ff5b67;
  outline-offset: 3px;
}

.bell-icon,
.cart-icon {
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
}

@media (min-width: 1024px) {
  .screen {
    padding-bottom: clamp(200px, 18vh, 260px);
  }

  .bottom-nav {
    bottom: 40px;
    border-radius: 32px;
  }
}
</style>
