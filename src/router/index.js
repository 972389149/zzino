import Vue from 'vue'
import Router from 'vue-router'
import LSUtils from '@/global-utils/local-storage-utils.js'

/* https://router.vuejs.org/zh-cn/advanced/lazy-loading.html */
/* 写法一： */
// const page1 = resolve => require(['./../components/page1.vue'], resolve)
/* 写法二： */
// const page1 = resolve => {
//   require.ensure(['./../components/pagexxxx.vue'], () => {
//     resolve(require('./../components/page1.vue'))
//   }, 'pageyyyy')
// }
/* 写法三： */
// const page1 = () => import(/* webpackChunkName: "page1" */ './../components/page1.vue')
/* 写法三，要保证项目 .babelrc文件 里面的"comments"项为true，这样，传进import函数的 魔法注释 才不会在完成babel处理之后被去掉，webpackChunkName字段才能被拿到。
   webpack执行后续的代码压缩步骤一般都会做删除注释的处理的，因此babel选择保留注释是不会影响工程最终的发布文件的： */
const login = () => import(/* webpackChunkName: "login" */ '@/pages/login/login')
const home = () => import(/* webpackChunkName: "home" */ '@/pages/home/home')
const register = () => import(/* webpackChunkName: "register" */ '@/pages/register/register')
const setPassword = () => import(/* webpackChunkName: "set-password" */ '@/pages/set-password/set-password')
const studentDetails = () => import(/* webpackChunkName: "student-details" */ '@/pages/student-details/student-details')

// 先抽取出来，方便以后用数组构造路径：
const courseManage = () => import(/* webpackChunkName: "course-manage" */ '@/components/course-manage/course-manage')
const analysis = () => import(/* webpackChunkName: "course-analysis" */ '@/components/course-analysis/course-analysis')
const classManage = () => import(/* webpackChunkName: "class-manage" */ '@/components/class-manage/class-manage')
const studentManage = () => import(/* webpackChunkName: "student-manage" */ '@/components/student-manage/student-manage')
const teacherManage = () => import(/* webpackChunkName: "teacher-manage" */ '@/components/teacher-manage/teacher-manage')
const seatManage = () => import(/* webpackChunkName: "seat-manage" */ '@/components/seat-manage/seat-manage')
const noteManage = () => import(/* webpackChunkName: "note-manage" */ '@/components/note-manage/note-manage')
const slideManage = () => import(/* webpackChunkName: "slide-manage" */ '@/components/slide-manage/slide-manage')
const courseData = () => import(/* webpackChunkName: "course-data" */ '@/components/course-data/course-data')

// 更低一级：课程观测courseData的几个子组件：
const correctRate = () => import(/* webpackChunkName: "correct-rate" */ '@/components/course-data/correct-rate')
const QATotal = () => import(/* webpackChunkName: "Q-A-total" */ '@/components/course-data/Q-A-total')
const questionType = () => import(/* webpackChunkName: "question-type" */ '@/components/course-data/question-type')
const timeView = () => import(/* webpackChunkName: "time-view" */ '@/components/course-data/time-view')
const hotspot = () => import(/* webpackChunkName: "hotspot" */ '@/components/course-data/hotspot')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: login
    },
    {
      path: '/home',
      redirect: '/home/course-data/correct-rate',
      component: home,
      children: [
        {
          path: 'course-manage',
          name: 'course-manage',
          component: courseManage
        },
        {
          path: 'course-analysis',
          name: 'course-analysis',
          component: analysis
        },
        {
          path: 'class-manage',
          name: 'class-manage',
          component: classManage
        },
        {
          path: 'student-manage',
          name: 'student-manage',
          component: studentManage
        },
        {
          path: 'teacher-manage',
          name: 'teacher-manage',
          component: teacherManage
        },
        {
          path: 'seat-manage',
          name: 'seat-manage',
          component: seatManage
        },
        {
          path: 'note-manage',
          name: 'note-manage',
          component: noteManage
        },
        {
          path: 'slide-manage',
          name: 'slide-manage',
          component: slideManage
        },
        {
          path: 'course-data',
          name: 'course-data',
          redirect: '/home/course-data/correct-rate',
          component: courseData,
          children: [
            {
              path: 'correct-rate',
              name: 'correct-rate',
              component: correctRate,
            },
            {
              path: 'Q-A-total',
              name: 'Q-A-total',
              component: QATotal,
            },
            {
              path: 'question-type',
              name: 'question-type',
              component: questionType,
            },
            {
              path: 'time-view',
              name: 'time-view',
              component: timeView,
            },
            {
              path: 'hotspot',
              name: 'hotspot',
              component: hotspot,
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/register',
      component: register
    },
    {
      path: '/set-password',
      component: setPassword
    },
    {
      path: '/student-details',
      component: studentDetails
    }
  ]
})

// 写好了！暂时先全注释掉：
// router.beforeEach((to, from, next) => {
//   console.log(from.fullPath)
//   console.log(to.fullPath)
//   // alert("登录已失效，请重新登录")
//   var loginURL = /^\/login/;
//   if (!LSUtils.getItemWithMaxAge('user')) {
//     if (to.fullPath === "/" || loginURL.test(to.fullPath)) {
//       next()
//     } else {
//       alert("未登录，无法完成跳转")
//       next({
//         path: '/login',
//         query: { redirect: to.fullPath }
//       })
//     }
//   } else {
//     next()
//   }
// })

export default router
