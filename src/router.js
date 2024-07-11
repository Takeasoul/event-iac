// src/router.js

import { createRouter, createWebHistory } from 'vue-router'
import admin_sign_in from './components/admin_sign_in.vue'
import admin_sign_up from './components/admin_sign_up.vue'
import admin_panel from './components/admin_panel.vue'
import registration_form from './components/registration_form.vue'
import approve from './components/approve.vue'
import events_members from './components/events_members.vue'
import eventSlider from "@/components/eventSlider.vue";
import eventMemberInfo from './components/event_member_info.vue'
import approve_registration from './components/approve_registration.vue'

const routes = [
    { path: '/login', component: admin_sign_in },
    { path: '/sign-up', component: admin_sign_up },
    { path: '/admin-panel', component: admin_panel },
    { path: '/:id/registration-form', component: registration_form },
    { path: '/event/:id/members', component: events_members },
    { path: '/approve', component: approve },
    { path: '/approve-registration', component: approve_registration },
    { path: '/:orgid/events', component: eventSlider },
    {path: '/event-member-info/:id', component: eventMemberInfo},
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router