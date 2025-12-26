<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cartStore'
import { useOrderStore } from '@/stores/orderStore'

const cartStore = useCartStore()
const orderStore = useOrderStore()
const { items } = storeToRefs(cartStore)

const totalPrice = computed(() => {
  const list = Array.isArray(items.value) ? items.value : []
  return list.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const handleCheckout = () => {
  if (!items.value.length) return

  items.value.forEach((item) => {
    orderStore.recordPurchase(
      item.menuName,
      item.quantity,
      item.price * item.quantity,
      item.storeName,
      '진행중',
    )
  })

  cartStore.clear()
  alert('결제가 완료되었습니다. 주문 내역과 교환권에서 확인해 주세요.')
}
</script>

<template>
  <section class="cart-page">
    <header class="page-header">
      <h1>장바구니</h1>
      <p>주문 전에 담긴 메뉴를 확인해 주세요.</p>
    </header>

    <div v-if="items.length === 0" class="empty-state">
      <div class="empty-icon">🛒</div>
      <p>장바구니가 비어 있어요.</p>
    </div>

    <ul v-else class="cart-list">
      <li v-for="item in items" :key="item.id" class="cart-card">
        <div class="info">
          <p class="store">{{ item.storeName ?? '매장' }}</p>
          <h3>{{ item.menuName }}</h3>
          <p class="price">
            {{ (item.price * item.quantity).toLocaleString() }}원
            <span aria-hidden="true">·</span>
            <span>{{ item.quantity }}개</span>
          </p>
        </div>
      </li>
    </ul>

    <footer v-if="items.length" class="checkout-bar">
      <div>
        <p class="label">결제 예정 금액</p>
        <p class="total">{{ totalPrice.toLocaleString() }}원</p>
      </div>
      <button class="pay-button" type="button" @click="handleCheckout">결제하기</button>
    </footer>
  </section>
</template>

<style scoped>
.cart-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 12px 10px 140px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header h1 {
  margin: 0;
  font-size: 26px;
  font-weight: 800;
}

.page-header p {
  margin: 6px 0 0;
  color: #6b7280;
  font-size: 14px;
}

.empty-state {
  flex: 1;
  min-height: 340px;
  display: grid;
  place-items: center;
  gap: 12px;
  color: #c5ccd5;
}

.empty-icon {
  font-size: 48px;
}

.cart-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.cart-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 8px 20px rgba(65, 72, 86, 0.1);
}

.info h3 {
  margin: 6px 0;
  font-size: 18px;
  color: #111827;
}

.store {
  margin: 0;
  color: #9ca3af;
  font-size: 13px;
}

.price {
  margin: 0;
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ghost-button {
  border: 1px solid #e5e7eb;
  background: transparent;
  color: #6b7280;
  padding: 8px 14px;
  border-radius: 12px;
  font-size: 14px;
  cursor: pointer;
}

.checkout-bar {
  position: sticky;
  bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-radius: 20px;
  background: #1f2937;
  color: #fff;
  box-shadow: 0 18px 32px rgba(17, 24, 39, 0.35);
  gap: 16px;
}

.label {
  margin: 0;
  font-size: 13px;
  color: #a9b1c3;
}

.total {
  margin: 4px 0 0;
  font-size: 22px;
  font-weight: 800;
}

.pay-button {
  border: none;
  padding: 14px 24px;
  border-radius: 14px;
  background: linear-gradient(135deg, #ff9a9e, #ff4e5c);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}
</style>
