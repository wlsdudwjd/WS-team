import { defineStore } from 'pinia'

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

export const useOrderStore = defineStore('orderStore', {
  state: () => ({
    orders: [] as OrderHistory[],
    coupons: [] as CouponItem[],
  }),
  actions: {
    recordPurchase(
      menuName: string,
      quantity: number,
      totalPrice: number,
      storeName?: string,
      status: OrderStatus = '진행중',
    ) {
      const timestamp = new Date()
      const formatted = `${timestamp.getFullYear()}-${(timestamp.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${timestamp.getDate().toString().padStart(2, '0')} ${timestamp
        .getHours()
        .toString()
        .padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')}`

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
    },
    useCoupon(id: number) {
      const coupon = this.coupons.find((c) => c.id === id)
      if (coupon) {
        coupon.status = '사용됨'
      }

      const order = this.orders.find((o) => o.id === id)
      if (order) {
        order.status = '수령완료'
      }
    },
  },
})
