import { createRouter, createWebHistory } from 'vue-router';
import NotFound from '@/views/NotFound.vue';

const routes = [
  {
    path: '/auth-forms/signin',
    name: 'SignIn',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AuthSignIn.vue'),
  },
  {
    path: '/auth-forms/register',
    name: 'Register',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AuthRegister.vue'),
  },
  {
    path: '/:catchAll(.*)*', component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
