<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { cafeStores, allCafeMenus } from './cafeData'
import { useOrderStore } from '@/stores/orderStore'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

// /cafe/:id/menu/:slug 형태라고 가정
const currentStoreId = computed(() => route.params.id as string)
const currentMenuSlug = computed(() => route.params.slug as string)

const currentStore = computed(() =>
  cafeStores.find((s) => s.id === currentStoreId.value),
)

const currentMenu = computed(() =>
  allCafeMenus.find((m) => m.slug === currentMenuSlug.value),
)

const quantity = ref(1)
const changeQuantity = (delta: number) => {
  quantity.value = Math.min(5, Math.max(1, quantity.value + delta))
}

const totalPrice = computed(() =>
  currentMenu.value ? currentMenu.value.price * quantity.value : 0,
)

const handleAction = (action: 'order' | 'pay') => {
  if (!currentMenu.value) return

  // 학식당과 동일한 스토어 API 사용
  orderStore.recordPurchase(
    currentMenu.value.name,
    quantity.value,
    totalPrice.value,
  )

  const message =
    action === 'order' ? '주문이 접수되었습니다.' : '결제가 완료되었습니다.'
  alert(
    `${message}\n메뉴: ${currentMenu.value.name} (${quantity.value}개)\n총액: ${totalPrice.value.toLocaleString()}원`,
  )
}
</script>

<template>
  <section class="order-page">
    <header class="order-toolbar">
      <button class="icon-button" aria-label="뒤로 가기" @click="router.back()">
        <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
          <path
            d="M15 4 7 12l8 8"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </header>

    <template v-if="currentStore && currentMenu">
      <div class="order-hero">
        <span class="order-icon">☕️</span>
        <div>
          <p class="eyebrow">
            {{ currentStore.name }}
          </p>
          <h1>{{ currentMenu.name }}</h1>
          <p class="subtitle">
            따뜻한 음료와 함께하는 여유로운 카페 메뉴
          </p>
        </div>
      </div>

      <div class="quantity-card">
        <div>
          <p class="label">수량</p>
          <strong>{{ quantity }}개</strong>
        </div>
        <div class="actions">
          <button class="qty-btn" aria-label="수량 감소" @click="changeQuantity(-1)">
            −
          </button>
          <button class="qty-btn" aria-label="수량 증가" @click="changeQuantity(1)">
            +
          </button>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-row">
          <span>단가</span>
          <strong>{{ currentMenu.price.toLocaleString() }}원</strong>
        </div>
        <div class="summary-row">
          <span>총 결제금액</span>
          <strong class="total">{{ totalPrice.toLocaleString() }}원</strong>
        </div>
      </div>

      <div class="cta-buttons">
        <button class="ghost" @click="handleAction('order')">주문하기</button>
        <button class="primary" @click="handleAction('pay')">바로 결제</button>
      </div>
    </template>

    <div v-else class="empty-state">
      <p>선택한 메뉴 정보를 찾을 수 없습니다.</p>
      <button class="icon-button" @click="router.push('/cafe')">
        목록으로 돌아가기
      </button>
    </div>
  </section>
</template>

<style scoped>
.order-page {
  max-width: 960px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-toolbar {
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

.order-hero {
  display: flex;
  gap: 16px;
  background: #fff;
  padding: 20px;
  border-radius: 24px;
  box-shadow: 0 18px 35px rgba(84, 97, 119, 0.13);
}

.order-icon {
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
  margin: 6px 0 0;
  color: #9ba4b0;
}

.quantity-card,
.summary-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 18px;
  box-shadow: 0 12px 24px rgba(84, 97, 119, 0.12);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  margin: 0;
  color: #6b7280;
}

.actions {
  display: flex;
  gap: 12px;
}

.qty-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: none;
  background: #f1f5f9;
  font-size: 1.4rem;
  cursor: pointer;
}

.summary-card {
  flex-direction: column;
  gap: 12px;
  align-items: stretch;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  color: #475569;
}

.summary-row .total {
  font-size: 1.2rem;
  color: #ff4e5c;
}

.cta-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.cta-buttons button {
  flex: 1;
  border: none;
  border-radius: 18px;
  padding: 14px;
  font-size: 1rem;
  cursor: pointer;
}

.cta-buttons .ghost {
  background: #f3f4f6;
  color: #334155;
}

.cta-buttons .primary {
  background: #ff4e5c;
  color: #fff;
}

.empty-state {
  text-align: center;
  color: #6b7280;
}
</style>
