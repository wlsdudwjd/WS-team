<template>
  <section class="notifications">
    <header class="top-bar">
      <button class="back-button" type="button" aria-label="뒤로가기" @click="router.back()">
        ‹
      </button>
      <h1>알림</h1>
      <span class="spacer" aria-hidden="true"></span>
    </header>

    <ul class="list">
      <li v-for="item in notifications" :key="item.id" class="list-item">
        <div class="icon">
          <span class="icon-mark">!</span>
        </div>
        <div class="content">
          <div class="title">{{ item.title }}</div>
          <div class="message">{{ item.message }}</div>
        </div>
        <div class="time">{{ item.time }}</div>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const notifications = [
  {
    id: 1,
    title: '상품이 수령되었습니다.',
    message: '이용해주셔서 감사합니다',
    time: '2025-06-04 12:50:18',
  },
  {
    id: 2,
    title: '주문 준비가 완료되었습니다.',
    message: '주문하신 상품이 준비되었습니다.',
    time: '2025-06-04 12:50:08',
  },
  {
    id: 3,
    title: '주문이 수락되었습니다.',
    message: '매장에서 상품 준비를 시작했습니다.',
    time: '2025-06-04 12:50:08',
  },
  {
    id: 4,
    title: '상품이 수령되었습니다.',
    message: '이용해주셔서 감사합니다',
    time: '2025-03-12 13:15:16',
  },
  {
    id: 5,
    title: '주문 준비가 완료되었습니다.',
    message: '주문하신 상품이 준비되었습니다.',
    time: '2025-03-12 13:15:06',
  },
  {
    id: 6,
    title: '주문이 수락되었습니다.',
    message: '매장에서 상품 준비를 시작했습니다.',
    time: '2025-03-12 13:15:06',
  },
  {
    id: 7,
    title: '상품이 수령되었습니다.',
    message: '이용해주셔서 감사합니다',
    time: '2024-11-29 12:47:32',
  },
  {
    id: 8,
    title: '주문 준비가 완료되었습니다.',
    message: '주문하신 상품이 준비되었습니다.',
    time: '2024-11-29 12:47:21',
  },
  {
    id: 9,
    title: '주문이 수락되었습니다.',
    message: '매장에서 상품 준비를 시작했습니다.',
    time: '2024-11-29 12:47:21',
  },
]
</script>

<style scoped>
.notifications {
  max-width: 720px;
  margin: 0 auto;
  padding: 12px 14px 40px;
}

.top-bar {
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  margin-bottom: 12px;
}

.top-bar h1 {
  margin: 0;
  text-align: center;
  font-size: 18px;
  color: #1f2937;
}

.back-button {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.06);
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
}

.spacer {
  display: block;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.list-item {
  display: grid;
  grid-template-columns: 40px 1fr auto;
  gap: 12px;
  padding: 12px 4px;
  border-bottom: 1px solid #eef1f5;
}

.icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #f0f4f8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-mark {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
}

.message {
  font-size: 13px;
  color: #6b7280;
}

.time {
  font-size: 12px;
  color: #9ca3af;
  white-space: nowrap;
  align-self: start;
}
</style>
