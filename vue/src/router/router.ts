import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw, RouteMeta } from 'vue-router';

import Home from '@/views/Home.vue';
import Rules from '@/views/Rules.vue';
import Challenges from '@/views/Challenges.vue';
import Scoreboard from '@/views/Scoreboard.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';

import Announcements from '@/views/admin/Announcements.vue';
import Categories from '@/views/admin/Categories.vue';
import Dashboard from '@/views/admin/Dashboard.vue';
import Teams from '@/views/admin/Teams.vue';
import Tools from '@/views/admin/Tools.vue';
import Users from '@/views/admin/Users.vue';
import Waves from '@/views/admin/Waves.vue';

import Profile from '@/views/Profile.vue';
import { useSessionStore } from '@/stores/session';

/* Type declarations for Route metadata.
 */
declare module 'vue-router'
{
    interface RouteMeta
    {
        requiresAuth?: boolean,     // User must be authenticated to access the route.
        requiresAdmin?: boolean,    // User must be authenticated AND have admin privileges to access the route.
        hideMainNav?: boolean,      // When true, will hide the main navigation bar on the page.
        showAdminNav?: boolean,     // When true, will show the main navigation bar on the page.
    }
}

/* Defining route paths.
 */
const routes: RouteRecordRaw[] =
[
    { path: '/', component: Home },
    { path: '/rules', component: Rules },
    { path: '/challenges', component: Challenges },
    { path: '/scoreboard', component: Scoreboard },
    { path: '/login', component: Login, meta: { hideMainNav: true } },
    { path: '/register', component: Register, meta: { hideMainNav: true } },
    { path: '/profile', component: Profile, meta: { requiresAuth: true } },
    { path: '/admin', meta: { requiresAdmin: true, showAdminNav: true }, children:
        [
            { path: '', component: Dashboard },
            { path: 'announcements', component: Announcements },
            { path: 'categories', component: Categories },
            { path: 'challenges', component: Challenges },
            { path: 'teams', component: Teams },
            { path: 'tools', component: Tools },
            { path: 'users', component: Users },
            { path: 'waves', component: Waves },
        ]},
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});

/* Navigation guard for views that require authorization.
 */
router.beforeEach((to, from) =>
{
    const sessionStore = useSessionStore();

    if (to.meta.requiresAdmin && !sessionStore.isAuthenticated(true))
    {
        return {
            path: '/login',
        };
    }

    if (to.meta.requiresAuth && !sessionStore.isAuthenticated())
    {
        return {
            path: '/login',
        };
    }
});

export default router;