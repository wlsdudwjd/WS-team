<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notificationStore'

const router = useRouter()
const notificationStore = useNotificationStore()
const { items } = storeToRefs(notificationStore)
const { reload } = notificationStore

onMounted(() => {
  reload()
})
</script>

<template>
  <section class="notifications">
    <header class="top-bar">
      <button class="back-button" type="button" aria-label="뒤로가기" @click="router.back()">
        ←
      </button>
      <h1>알림</h1>
      <span class="spacer" aria-hidden="true"></span>
    </header>

    <p v-if="!items.length" class="empty">알림이 없습니다.</p>

    <ul v-else class="list">
      <li v-for="item in items" :key="item.id" class="list-item">
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
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}

.spacer {
  display: block;
}

.empty {
  margin: 12px 0 0;
  color: #6b7280;
  font-size: 14px;
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
