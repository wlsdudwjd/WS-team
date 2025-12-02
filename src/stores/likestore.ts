import { defineStore } from 'pinia'

export type MenuKind = 'cafeteria' | 'cafe'

export interface LikeItem {
  id: string               // kind + menuSlug
  kind: MenuKind           // 'cafeteria' | 'cafe'
  menuSlug: string         // 예: 'kimchi-jjigae'
  menuName: string         // 예: '김치찌개'
  sourceName: string       // 예: '② 찌개 · 돌솥' 또는 '쿱카페 후생관점'
  likes: number
}

interface LikeState {
  items: Record<string, LikeItem>
}

export const useLikeStore = defineStore('likeStore', {
  state: (): LikeState => ({
    items: {},
  }),

  getters: {
    // 좋아요 순으로 정렬된 전체 랭킹
    ranking(state): LikeItem[] {
      return Object.values(state.items).sort((a, b) => b.likes - a.likes)
    },
  },

  actions: {
    // 좋아요 1 증가 (나중에 여기서 백엔드 API 호출하면 됨)
    like(payload: {
      kind: MenuKind
      menuSlug: string
      menuName: string
      sourceName: string
    }) {
      const key = `${payload.kind}:${payload.menuSlug}`
      const existing = this.items[key]

      if (existing) {
        existing.likes += 1
      } else {
        this.items[key] = {
          id: key,
          kind: payload.kind,
          menuSlug: payload.menuSlug,
          menuName: payload.menuName,
          sourceName: payload.sourceName,
          likes: 1,
        }
      }
    },
  },
})
