// src/router.js

import { createRouter, createWebHistory } from 'vue-router'
import admin_sign_in from './components/admin_sign_in.vue'
import admin_sign_up from './components/admin_sign_up.vue'
import admin_panel from './components/admin_panel.vue'
import registration_form from './components/registration_form.vue'

const routes = [
    { path: '/login', component: admin_sign_in },
    { path: '/sign-up', component: admin_sign_up },
    { path: '/admin-panel', component: admin_panel },
    { path: '/registration-form', component: registration_form },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router