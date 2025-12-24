import { defineStore } from 'pinia'
import { useNotificationStore } from './notificationStore'

export type OrderStatus = '진행중' | '수령완료'

export type OrderHistory = {
  id: number
  menuName: string
  quantity: number
  totalPrice: number
  orderedAt: string
  storeName?: string
  status: OrderStatus
}

export type CouponStatus = '사용하기' | '사용됨'

export type CouponItem = {
  id: number
  menuName: string
  createdAt: string
  quantity: number
  status: CouponStatus
  storeName?: string
}

const getUserEmail = () => localStorage.getItem('ws_user_email') ?? 'guest'
const storageKey = (type: 'orders' | 'coupons') => `ws_${type}_${getUserEmail()}`

const loadOrders = (): OrderHistory[] => {
  try {
    const raw = localStorage.getItem(storageKey('orders'))
    if (!raw) return []
    return JSON.parse(raw) as OrderHistory[]
  } catch (err) {
    console.error('주문 내역 로드 실패', err)
    return []
  }
}

const loadCoupons = (): CouponItem[] => {
  try {
    const raw = localStorage.getItem(storageKey('coupons'))
    if (!raw) return []
    return JSON.parse(raw) as CouponItem[]
  } catch (err) {
    console.error('쿠폰 로드 실패', err)
    return []
  }
}

const persistOrders = (orders: OrderHistory[]) => {
  try {
    localStorage.setItem(storageKey('orders'), JSON.stringify(orders))
  } catch (err) {
    console.error('주문 내역 저장 실패', err)
  }
}

const persistCoupons = (coupons: CouponItem[]) => {
  try {
    localStorage.setItem(storageKey('coupons'), JSON.stringify(coupons))
  } catch (err) {
    console.error('쿠폰 저장 실패', err)
  }
}

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

export const useOrderStore = defineStore('orderStore', {
  state: () => ({
    orders: loadOrders() as OrderHistory[],
    coupons: loadCoupons() as CouponItem[],
    currentEmail: getUserEmail(),
  }),
  actions: {
    ensureCurrentUser() {
      const latestEmail = getUserEmail()
      if (latestEmail !== this.currentEmail) {
        this.currentEmail = latestEmail
        this.orders = loadOrders()
        this.coupons = loadCoupons()
      }
    },
    recordPurchase(
      menuName: string,
      quantity: number,
      totalPrice: number,
      storeName?: string,
      status: OrderStatus = '진행중',
    ) {
      this.ensureCurrentUser()
      const timestamp = new Date()
      const formatted = `${timestamp.getFullYear()}-${(timestamp.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${timestamp.getDate().toString().padStart(2, '0')} ${timestamp
        .getHours()
        .toString()
        .padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')}:${timestamp
        .getSeconds()
        .toString()
        .padStart(2, '0')}`

      const order: OrderHistory = {
        id: Date.now(),
        menuName,
        quantity,
        totalPrice,
        orderedAt: formatted,
        storeName,
        status,
      }

      const coupon: CouponItem = {
        id: order.id,
        menuName,
        createdAt: formatted,
        quantity,
        status: '사용하기',
        storeName,
      }

      this.orders.unshift(order)
      this.coupons.unshift(coupon)
      persistOrders(this.orders)
      persistCoupons(this.coupons)

      const notifications = useNotificationStore()
      notifications.addNotification({
        title: '주문이 접수되었습니다.',
        message: `${storeName ?? '매장'}에서 주문을 확인했어요.`,
        time: formatted,
      })
    },
    useCoupon(id: number) {
      this.ensureCurrentUser()
      const coupon = this.coupons.find((c) => c.id === id)
      if (coupon) {
        coupon.status = '사용됨'
      }

      const order = this.orders.find((o) => o.id === id)
      if (order) {
        order.status = '수령완료'
      }

      persistOrders(this.orders)
      persistCoupons(this.coupons)

      const notifications = useNotificationStore()
      notifications.addNotification({
        title: '상품이 수령되었습니다.',
        message: `${order?.storeName ?? '매장'}에서 상품을 수령하셨습니다.`,
        time: formatNow(),
      })
    },
    clearAll() {
      this.ensureCurrentUser()
      this.orders = []
      this.coupons = []
      persistOrders(this.orders)
      persistCoupons(this.coupons)
    },
    reload() {
      this.ensureCurrentUser()
    },
  },
})
