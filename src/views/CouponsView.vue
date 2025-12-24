<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useOrderStore } from '@/stores/orderStore'

const orderStore = useOrderStore()
const { coupons } = storeToRefs(orderStore)

const filters = ['사용가능', '기간만료'] as const
const activeFilter = ref<(typeof filters)[number]>('사용가능')

const filteredCoupons = computed(() => {
  if (activeFilter.value === '사용가능') {
    return coupons.value.filter((c) => c.status !== '사용됨')
  }
  return coupons.value.filter((c) => c.status === '사용됨')
})

const totalText = computed(() => `총 ${filteredCoupons.value.length}개`)

const handleUseCoupon = (id: number) => {
  orderStore.useCoupon(id)
}

onMounted(() => {
  orderStore.reload()
})
</script>

<template>
  <section class="coupon-page">
    <header class="page-header">
      <h1>교환권</h1>
    </header>

    <div class="filter-row">
      <div class="segmented">
        <button
          v-for="filter in filters"
          :key="filter"
          type="button"
          :class="{ active: activeFilter === filter }"
          @click="activeFilter = filter"
        >
          {{ filter }}
        </button>
      </div>
      <button class="sort-button" type="button">⇅ 오래된순</button>
    </div>

    <div class="total-row">{{ totalText }}</div>

    <div v-if="filteredCoupons.length === 0" class="empty-state">
      <div class="empty-icon">🎟️</div>
      <p>보유한 교환권이 없습니다</p>
    </div>

    <ul v-else class="coupon-list">
      <li v-for="coupon in filteredCoupons" :key="coupon.id" class="coupon-card">
        <div>
          <h3>{{ coupon.menuName }}</h3>
          <p>{{ coupon.storeName ?? '교환권' }} · {{ coupon.createdAt }} · {{ coupon.quantity }}개</p>
        </div>
        <button
          class="coupon-button"
          :disabled="coupon.status === '사용됨'"
          @click="handleUseCoupon(coupon.id)"
        >
          {{ coupon.status }}
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.coupon-page {
  max-width: 680px;
  margin: 0 auto;
  padding: 12px 10px 140px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header h1 {
  margin: 0;
  font-size: 26px;
  font-weight: 800;
}

.filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.segmented {
  display: inline-flex;
  background: #f5f6f8;
  border-radius: 999px;
  padding: 4px;
  gap: 6px;
}

.segmented button {
  border: none;
  background: transparent;
  padding: 8px 14px;
  border-radius: 999px;
  font-weight: 700;
  color: #6b7280;
  cursor: pointer;
}

.segmented button.active {
  background: #111827;
  color: #fff;
}

.sort-button {
  border: none;
  background: none;
  color: #6b7280;
  font-weight: 700;
  cursor: pointer;
}

.total-row {
  color: #6b7280;
  font-size: 14px;
}

.empty-state {
  flex: 1;
  min-height: 360px;
  display: grid;
  place-items: center;
  gap: 12px;
  color: #c5ccd5;
}

.empty-icon {
  font-size: 42px;
}

.coupon-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.coupon-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 10px 20px rgba(84, 97, 119, 0.12);
}

.coupon-card h3 {
  margin: 0 0 4px;
  font-size: 1rem;
}

.coupon-card p {
  margin: 0;
  color: #9ba4b0;
  font-size: 0.85rem;
}

.coupon-button {
  border: none;
  border-radius: 999px;
  padding: 8px 16px;
  background: #eef2ff;
  color: #4c1d95;
  font-weight: 600;
  cursor: pointer;
}

.coupon-button:disabled {
  background: #e5e7eb;
  color: #9ca3af;
  cursor: default;
}
</style>
