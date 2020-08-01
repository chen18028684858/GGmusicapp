import Vue from 'vue'
import Vuex from 'vuex'
import {songModule} from './songStore/modules'
Vue.use(Vuex)

export default new Vuex.Store({
  state:{
    playIsShow:false,
    isPlay:false,//播放器是否播放
    playIng:{
      url:'index-play.png'
    },//播放图标
    pauseIng:{
      url:'index-pause.png'
    },//暂停图标
    audio:'',
    playerInfo:{
      songName:'',
      singer:'',
      picUrl:''
    },//底部播放器的歌名及歌手
    xuanzhuanImg:'',//旋转的图片
    
    songUrl:'',
    songLrcs:[],
    allPlayUrl:[],
    currentPlayList:[],
    nowIndex:0,
    searchHistoryNav:[],
    searchList:[],
    searchSongId:[]
  },
  modules:{
    songModule
  },
  mutations:{
    getPlayIsShow(state,value){
      state.playIsShow = value
    },
    playOrPause(state,value){
      state.isPlay = value;
    },
    songLrc(state,value){
      state.songLrcs = value;
    },
    taggleIsPlay(state,value){
      state.isPlay = value;
    },
    getAllSongUrl(state,value){
      state.allPlayUrl = value
    },
    getCcurrentPlayList(state,value){
      state.currentPlayList = value
    },
    changeNowIndex(state,value){
      state.nowIndex = value
    },
    getSearchList(state,value){
      state.searchList = value
    },
    getSearchHistoryNav(state,value){
      state.searchHistoryNav = value
    },
    getSearchSongId(state,value){
      state.searchSongId = value
    },
  }
})
