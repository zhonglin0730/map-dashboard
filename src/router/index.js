import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/urban'
        },
        {
            path: '/urban',
            name: 'urban',
            component: () => import('../views/Urban.vue')
        },
        {
            path: '/livelihood',
            name: 'livelihood',
            component: () => import('../views/Livelihood.vue')
        },
        {
            path: '/party',
            name: 'party',
            component: () => import('../views/Party.vue')
        },
        {
            path: '/safe',
            name: 'safe',
            component: () => import('../views/Safe.vue')
        }
    ]
})

export default router
