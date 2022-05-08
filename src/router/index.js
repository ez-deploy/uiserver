import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/ui',
    name: 'ui',
    component: () => import('../views/view-holder.vue'),
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('../views/index.vue')
      },
      {
        path: 'project/list',
        name: 'projectlist',
        component: () => import('../views/project/project-list.vue')
      },
      {
        path: 'project/show/:id',
        name: 'projectshow',
        component: () => import('../views/project/project-show.vue')
      },
      {
        path: "service/show/:id",
        name: "serviceshow",
        component: () => import('../views/service/service-show.vue'),
        children: [
          {
            path: 'info',
            name: 'serviceinfo',
            component: () => import('../views/service/service-info.vue')
          },
          {
            path: 'version',
            name: 'serviceversion',
            component: () => import('../views/service/service-version.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('../views/user/user-holder.vue'),
    children: [
      {
        path: 'login',
        name: 'login_user',
        component: () => import('../views/user/login.vue')
      },
      {
        path: 'create',
        name: 'create_user',
        component: () => import('../views/user/create.vue')
      },
    ]
  },
  {
    path: '/term',
    name: 'term',
    component: () => import('../views/service/term.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
