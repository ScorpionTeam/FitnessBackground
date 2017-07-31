import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/index.vue'
import Member from '@/views/member/Member.vue'
import MemberRegister from '@/views/member/MemberRegister.vue'
import Stadium from '@/views/stadium/Stadium.vue'
import StadiumAdd from '@/views/stadium/StadiumAdd.vue'
import Vip from '@/views/vip/Vip.vue'
import Login from '@/components/login/Login.vue'
import PrivateClass from '@/views/privateclass/PrivateClass.vue'
import GroupClass from '@/views/groupclass/GroupClass'
import GroupClassAdd from '@/views/groupclass/GroupClassAdd.vue'
import Coach from '@/views/coach/Coach.vue'
import Activity from '@/views/activity/Activity.vue'
import ActivityAdd from '@/views/activity/ActivityAdd.vue'
import News from '@/views/news/News.vue'
import StatisticsMain from '@/views/statistics/StatisticsMain.vue'
import Impression from '@/views/impression/Impression.vue'
import Meal from '@/views/meal/Meal.vue'
import  Picture from '@/views/picture/Picture.vue'


Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: 'login'
  },
    {
      path: '/index',
      name: 'Index',
      meta: {
        title: '首页'
      },
      component: Index,
      children: [{
        path: '/member',
        name: 'member',
        meta: {
          title: '会员'
        },
        component: Member
      }, {
        path: '/register',
        name: '注册',
        meta: {
          title: '注册'
        },
        component: MemberRegister
      }, {
        path: '/stadium',
        name: 'stadium',
        meta: {
          title: '场馆'
        },
        component: Stadium
      }, {
        path: '/stadiumAdd',
        name: 'stadiumAdd',
        meta: {
          title: '创建场馆'
        },
        component: StadiumAdd
      }, {
        path: '/vip',
        name: 'vip',
        meta: {
          title: '会员卡'
        },
        component: Vip
      }, {
        path: '/private-class',
        name: 'private-class',
        meta: {
          title: '私教'
        },
        component: PrivateClass
      }, {
        path: '/group-class',
        name: 'group-class',
        meta: {
          title: '团体'
        },
        component: GroupClass
      }, {
        path: '/group-class-add',
        name: 'group-class-add',
        meta: {
          title: '创建团课'
        },
        component: GroupClassAdd
      }, {
        path: '/coach',
        name: 'coach',
        meta: {
          title: '教练'
        },
        component: Coach
      }, {
        path: '/activity',
        name: 'activity',
        meta: {
          title: '活动'
        },
        component: Activity
      },
        {
          path: '/activity-add',
          name: 'activity-add',
          meta: {
            title: '创建活动'
          },
          component: ActivityAdd
        }
        , {
          path: '/news',
          name: 'news',
          meta: {
            title: '发言'
          },
          component: News
        }, {
          path: '/statistics',
          name: 'statistics',
          meta: {
            title: '统计'
          },
          component: StatisticsMain
        }, {
          path: '/impression',
          name: 'impression',
          meta: {
            title: '印象'
          },
          component: Impression
        }, {
          path: '/meal',
          name: 'meal',
          meta: {
            title: '餐饮'
          },
          component: Meal
        },{
              path: '/picture',
              name: 'picture',
              meta: {
                  title: '图片'
              },
              component: Picture
          }]
    }, {
      path: '/login',
      name: 'login',
      meta: {
        title: '登录'
      },
      component: Login
    }
  ]
})
