import {createRouter, createWebHistory} from 'vue-router'
import {useUserStore} from '@/stores/user.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login' // 默认重定向到登录页面
    },
    {
      path: '/login',
      component: () => import('@/views/login/LoginPage.vue')
    },
    {
      path: '/admin',
      component: () => import('@/views/admin/LayOut.vue'),
      children: [
        {
          path: '',
          redirect: '/admin/display' // 默认重定向到显示页面
        },
        {
          path: 'display', // 自动继承父路径 /admin/
          component: () => import('@/views/admin/DataDisplay.vue')
        },
        {
          path: 'book',
          component: () => import('@/views/admin/BookInfo.vue')
        },
        {
          path: 'class',
          component: () => import('@/views/admin/StudentInfo.vue')
        },
        {
          path: 'borrowDetail',
          component: () => import('@/views/admin/BorrowDetail.vue')
        },
        {
          path: 'borrowStatistic',
          component: () => import('@/views/admin/BorrowStatistic.vue')
        },
      ]
    },
    {
      path: '/student',
      component: () => import('@/views/student/LayOut.vue'),
      children: [
        {
          path: '',
          redirect: '/student/bookBorrow' // 默认重定向到显示页面
        },
        {
          path: 'bookBorrow',
          component: () => import('@/views/student/BookBorrow.vue')
        }
      ]
    },
    {
      path: '/404',
      component: () => import('@/views/error/404.vue')
    },
    // 将catch-all路由放在最后
    {
      path: '/:pathMatch(.*)',
      redirect: '/404' // 重定向到 404 页面
    }
  ]
})
// 登录访问拦截
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const token = userStore.token
  const role = userStore.role // 获取存储的角色信息 (整数)

  console.log('Token:', token, 'Role:', role, 'Path:', to.path)

  // TODO: 有没有一种方法可以通过登录学生账号拿到token，然后伪造role为0，从而直接绕过管理员登录，直接访问管理员才能看到的界面
  if (!token && to.path !== '/login') {
    // 如果没有token且访问的不是登录页，跳转到登录页
    next('/login')
  } else if (token) {
    // 如果有token，则进行角色判断
    if (role === 0 && to.path.startsWith('/admin')) {
      // 如果角色是管理员（role === 0），且访问管理员路径，放行
      next()
    } else if (role === 1 && to.path.startsWith('/student')) {
      // 如果角色是学生（role === 1），且访问学生路径，放行
      next()
    } else {
      // 如果角色不匹配，重定向到对应角色的默认页面
      if (role === 0) {
        next('/admin/display')
      } else if (role === 1) {
        next('/student/bookBorrow')
      } else {
        // 处理异常情况，比如角色为空或未定义
        next('/login')
      }
    }
  } else {
    // 如果既没有token，也不在以上条件中，默认放行
    next()
  }
})


export default router
