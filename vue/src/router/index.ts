import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import Home from '../views/Home.vue';
import Rules from '../views/Rules.vue';
import Challenges from '../views/Challenges.vue';
import Scoreboard from '../views/Scoreboard.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';

const routes: RouteRecordRaw[] = 
[
    { path: '/', component: Home },
    { path: '/rules', component: Rules },
    { path: '/challenges', component: Challenges },
    { path: '/scoreboard', component: Scoreboard },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});

export default router;