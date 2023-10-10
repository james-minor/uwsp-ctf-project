import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw, RouteMeta } from 'vue-router';

import Home from '@/views/Home.vue';
import Rules from '@/views/Rules.vue';
import Challenges from '@/views/Challenges.vue';
import Scoreboard from '@/views/Scoreboard.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';

import Dashboard from '@/views/admin/Dashboard.vue';
import Categories from '@/views/admin/Categories.vue';
import Tools from '@/views/admin/Tools.vue';
import Users from '@/views/admin/Users.vue';
import Waves from '@/views/admin/Waves.vue';
import Profile from '@/views/Profile.vue';

declare module 'vue-router'
{
    interface RouteMeta
    {
        requiresAuth?: boolean,     // User must be authenticated to access the route.
        requiresAdmin?: boolean,    // User must be authenticated AND have admin privileges to access the route.
    }
}

const routes: RouteRecordRaw[] =
[
    { path: '/', component: Home },
    { path: '/rules', component: Rules },
    { path: '/challenges', component: Challenges },
    { path: '/scoreboard', component: Scoreboard },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/profile', component: Profile, meta: { requiresAuth: true } },
    { path: '/admin', component: Dashboard, meta: { requiresAdmin: true } },
    { path: '/admin/categories', component: Categories, meta: { requiresAdmin: true } },
    { path: '/admin/challenges', component: Challenges, meta: { requiresAdmin: true } },
    { path: '/admin/tools', component: Tools, meta: { requiresAdmin: true } },
    { path: '/admin/users', component: Users, meta: { requiresAdmin: true } },
    { path: '/admin/waves', component: Waves, meta: { requiresAdmin: true } },
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});

export default router;