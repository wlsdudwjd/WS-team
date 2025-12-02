// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import PopularView from '@/views/PopularView.vue'
import EventView from '@/views/EventView.vue'
import StoreView from '@/views/StoreView.vue'
import CafeteriaView from '@/views/CafeteriaView.vue'
import CafeView from '@/views/CafeView.vue'
import CafeStoreView from '@/views/CafeStoreView.vue'
import CafeOrderView from '@/views/CafeOrderView.vue'
import CafeteriaStoreView from '@/views/CafeteriaStoreView.vue'
import CafeteriaCounterView from '@/views/CafeteriaCounterView.vue'
import CafeteriaOrderView from '@/views/CafeteriaOrderView.vue'
import CouponsView from '@/views/CouponsView.vue'
import OrdersView from '@/views/OrdersView.vue'
import MyPageView from '@/views/MyPageView.vue'
import RecommendView from '@/views/RecommendView.vue'
import NotificationsView from '@/views/NotificationsView.vue'

// 🔹 Firebase Auth 가져오기
import { auth } from '@/firebase/firebase'  // auth 인스턴스 export 해둔 파일

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 루트로 들어오면 일단 /login으로
    { path: '/', redirect: '/login' },

    // 로그인 페이지: 이미 로그인한 유저는 들어올 필요 없으니 requiresGuest
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true },
    },

    // 🔒 여기서부터는 로그인 필요한 페이지들
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/popular',
      name: 'popular',
      component: PopularView,
      meta: { requiresAuth: true },
    },
    {
      path: '/event',
      name: 'event',
      component: EventView,
      meta: { requiresAuth: true },
    },
    {
      path: '/store/:id',
      name: 'store',
      component: StoreView,
      meta: { requiresAuth: true },
    },
    {
      path: '/cafeteria',
      name: 'cafeteria',
      component: CafeteriaView,
      meta: { requiresAuth: true },
    },
    {
      path: '/cafe',
      name: 'cafe',
      component: CafeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/cafe/:id',
      name: 'cafe-store',
      component: CafeStoreView,
      meta: { requiresAuth: true },
    },
    {
      path: '/cafe/:id/menu/:slug',
      name: 'cafe-order',
      component: CafeOrderView,
      meta: { requiresAuth: true },
    },
    {
      path: '/cafeteria/huseng',
      name: 'cafeteria-huseng',
      component: CafeteriaStoreView,
      meta: { requiresAuth: true },
    },
    {
      path: '/cafeteria/huseng/:slug',
      name: 'cafeteria-counter',
      component: CafeteriaCounterView,
      meta: { requiresAuth: true },
    },
    {
      path: '/cafeteria/huseng/:slug/menu/:menu',
      name: 'cafeteria-order',
      component: CafeteriaOrderView,
      meta: { requiresAuth: true },
    },
    {
      path: '/coupons',
      name: 'coupons',
      component: CouponsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrdersView,
      meta: { requiresAuth: true },
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: MyPageView,
      meta: { requiresAuth: true },
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: NotificationsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/recommend/:filter?',
      name: 'recommend',
      component: RecommendView,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest)

  const user = auth.currentUser  // 현재 로그인한 유저 (없으면 null)

  // 1) 로그인 필요한데, 유저가 없으면 → 로그인 페이지로 튕기기
  if (requiresAuth && !user) {
    next({
      name: 'login',
      query: { redirect: to.fullPath }, // 로그인 후 다시 돌아올 수 있게
    })
    return
  }

  // 2) 손님만 들어와야 하는 페이지(로그인 페이지)에 이미 로그인한 사람이 들어오면 → home으로
  if (requiresGuest && user) {
    next({ name: 'home' })
    return
  }

  // 나머지는 그냥 진행
  next()
})

export default router
