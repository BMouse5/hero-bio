import { createRouter, createWebHistory} from "vue-router";

import MainPage from "../MainPage.vue";
import PolicyPage from "../PolicyPage.vue";

const routes = [
    {
        path: '/',
        name: 'MainPage',
        component: MainPage
    },
    {
        path: '/privacy-policy',
        name: 'PolicyPage',
        component: PolicyPage
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router