export const routes = [

  {
    path: '/login',
    name: 'Login',
    component: r => require(['../views/Login.vue'],r)
  },
  {
    path: '/register',
    name: 'Register',
    component: r => require(['../views/Register.vue'],r)
  },
  {
    path: '/main',
    name: 'Main',
    component: r => require(['../views/Main.vue'],r),
    // children:[
    //   {
    //     path: 'index',
    //     name: 'Index',
    //     component: r => require(['../views/mainViews/Index.vue'],r)
    //   },
    //   {
    //     path: 'search',
    //     name: 'Search',
    //     component: r => require(['../views/mainViews/Search.vue'],r)
    //   },
    //   {
    //     path: 'songlistmore',
    //     name: 'SongListMore',
    //     component: r => require(['../views/mainViews/SongListMore.vue'],r)
    //   },
    //   {
    //     path: 'my',
    //     name: 'My',
    //     component: r => require(['../views/mainViews/My.vue'],r)
    //   },
    // ]
  },
  {
    path: '/music',
    name: 'Music',
    component: r => require(['../views/Music.vue'],r)
  },
  {
    path:'/singer',
    name:'Singer',
    component: r => require (['../views/Singer.vue'],r)
  },
  {
    path:'/songListDetails',
    name:'SongListDetails',
    component: r => require (['../views/SongListDetails.vue'],r)
  },
  {
    path:'/rankinglist',
    name:'RankingList',
    component: r => require (['../views/RankingList.vue'],r)
  },
  {
    path:'/goodsonglist',
    name:'GoodSongList',
    component: r => require (['../views/GoodSongList.vue'],r)
  },
  {
    path:'/search',
    name:'Search',
    component: r => require (['../views/Search.vue'],r)
  },

  {
    path:'*',
    redirect:{
      name:'Main'
    }
  }
  
]