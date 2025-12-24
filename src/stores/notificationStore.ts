import { defineStore } from 'pinia'

export type NotificationItem = {
  id: number
  title: string
  message: string
  time: string
}

const getUserEmail = () => localStorage.getItem('ws_user_email') ?? 'guest'
const storageKey = () => `ws_notifications_${getUserEmail()}`

const formatNow = () => {
  const t = new Date()
  const yyyy = t.getFullYear()
  const mm = String(t.getMonth() + 1).padStart(2, '0')
  const dd = String(t.getDate()).padStart(2, '0')
  const hh = String(t.getHours()).padStart(2, '0')
  const min = String(t.getMinutes()).padStart(2, '0')
  const ss = String(t.getSeconds()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`
}

const loadNotifications = (): NotificationItem[] => {
  try {
    const raw = localStorage.getItem(storageKey())
    if (!raw) return []
    return JSON.parse(raw) as NotificationItem[]
  } catch (err) {
    console.error('알림 로드 실패', err)
    return []
  }
}

const persistNotifications = (items: NotificationItem[]) => {
  try {
    localStorage.setItem(storageKey(), JSON.stringify(items))
  } catch (err) {
    console.error('알림 저장 실패', err)
  }
}

export const useNotificationStore = defineStore('notificationStore', {
  state: () => ({
    items: loadNotifications() as NotificationItem[],
    currentEmail: getUserEmail(),
  }),
  actions: {
    ensureCurrentUser() {
      const latestEmail = getUserEmail()
      if (latestEmail !== this.currentEmail) {
        this.currentEmail = latestEmail
        this.items = loadNotifications()
      }
    },
    addNotification(payload: { title: string; message: string; time?: string }) {
      this.ensureCurrentUser()
      const item: NotificationItem = {
        id: Date.now(),
        title: payload.title,
        message: payload.message,
        time: payload.time ?? formatNow(),
      }
      this.items.unshift(item)
      persistNotifications(this.items)
    },
    clearAll() {
      this.ensureCurrentUser()
      this.items = []
      persistNotifications(this.items)
    },
    reload() {
      this.ensureCurrentUser()
    },
  },
})
