<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useOrderStore, type OrderStatus } from '@/stores/orderStore'

const orderStore = useOrderStore()
const { orders } = storeToRefs(orderStore)

const tabs = ['진행중', '전체 내역'] as const
const activeTab = ref<(typeof tabs)[number]>('진행중')

const ordersWithStatus = computed(() =>
  orders.value.map((o) => ({ ...o, status: (o as any).status ?? '수령완료' }))
)

const filteredOrders = computed(() => {
  if (activeTab.value === '진행중') {
    return ordersWithStatus.value.filter((o) => o.status === '진행중')
  }
  return ordersWithStatus.value
})

const getStatusLabel = (status: OrderStatus) => {
  if (status === '진행중' && activeTab.value === '전체 내역') {
    return '미수령'
  }
  return status
}

onMounted(() => {
  orderStore.reload()
})
</script>

<template>
  <section class="orders-page">
    <header class="page-header">
      <h1>주문 내역</h1>
    </header>

    <div class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab"
        type="button"
        :class="['tab', { active: activeTab === tab }]"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <div v-if="filteredOrders.length === 0" class="empty-state">
      <div class="empty-icon">🧾</div>
      <p>주문 현황이 없습니다.</p>
    </div>

    <ul v-else class="order-list">
      <li v-for="order in filteredOrders" :key="order.id" class="order-card">
        <div class="store-icon">🍽️</div>
        <div class="info">
          <div class="title-row">
            <h3>{{ order.storeName ?? '주문' }}</h3>
            <span class="time">{{ order.orderedAt }}</span>
          </div>
          <div class="status" :class="order.status === '진행중' ? 'status-pending' : ''">
            {{ getStatusLabel(order.status) }}
          </div>
          <div class="menu-line">
            <span class="code">A{{ order.id.toString().slice(-3) }}</span>
            <span class="dot">|</span>
            <span class="menu">{{ order.menuName }}</span>
          </div>
        </div>
        <div class="chevron">›</div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.orders-page {
  max-width: 720px;
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

.tab-bar {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding-bottom: 4px;
  border-bottom: 1px solid #e5e7eb;
}

.tab {
  border: none;
  background: none;
  padding: 10px 0;
  font-size: 16px;
  font-weight: 700;
  color: #c3cad4;
  cursor: pointer;
}

.tab.active {
  color: #1f2937;
  position: relative;
}

.tab.active::after {
  content: '';
  position: absolute;
  left: 24%;
  right: 24%;
  bottom: -6px;
  height: 3px;
  border-radius: 999px;
  background: #111827;
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
  font-size: 48px;
}

.order-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-card {
  display: grid;
  grid-template-columns: 52px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 8px 18px rgba(84, 97, 119, 0.12);
}

.store-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: #e8f0ff;
  display: grid;
  place-items: center;
  font-size: 22px;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.title-row h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: #1f2937;
}

.time {
  color: #9ca3af;
  font-size: 12px;
}

.status {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 8px;
  background: #e7e9ff;
  color: #4f46e5;
  font-weight: 700;
  font-size: 12px;
  width: fit-content;
}

.status-pending {
  background: #fff7ed;
  color: #ea580c;
}

.menu-line {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #374151;
  font-size: 14px;
}

.code {
  font-weight: 700;
}

.dot {
  color: #cbd5e1;
}

.chevron {
  color: #cbd5e1;
  font-size: 20px;
}
</style>
