import { createRouter, createWebHistory } from 'vue-router'
import GameView from '../views/GameView.vue'
import HowToPlay from '../views/HowToPlay.vue'
import AboutView from '../views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'game',
      component: GameView,
    },
    {
      path: '/how-to-play',
      name: 'how-to-play',
      component: HowToPlay,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
  ],
})

export default router
