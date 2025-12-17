import { defineStore } from 'pinia'

export type CartItem = {
  id: number
  menuName: string
  storeName?: string
  price: number
  quantity: number
}

export const useCartStore = defineStore('cartStore', {
  state: () => ({
    items: [] as CartItem[],
  }),
  getters: {
    itemCount: (state) => state.items.length,
  },
  actions: {
    addItem(payload: { menuName: string; storeName?: string; price: number; quantity: number }) {
      const existing = this.items.find(
        (item) => item.menuName === payload.menuName && item.storeName === payload.storeName,
      )

      if (existing) {
        existing.quantity += payload.quantity
        return
      }

      this.items.unshift({
        id: Date.now(),
        ...payload,
      })
    },
    clear() {
      this.items = []
    },
  },
})
