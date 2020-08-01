<template>
  <div class="songListDetails">
    <van-nav-bar
      left-text="返回"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="goBack"
    />
    <div class="clearfix topBg" :style="{'backgroundImage':'url(' + songImg + ')'}">
      
    </div>
    <div class="topBgBox">
      <div class="topImg fl">
        <img class="auto_img" :src="songImg" >
      </div>
      <div class="fl topDesc">
        <div class="topTitle">{{titleName}}</div>
        <div class="topUser clearfix">
          <div class="fl creatorImg">
            <img class="auto_img" :src="creatorImg" >  
          </div>  
          <div class="fl">{{nickname}}</div>
        </div>
      </div>
    </div>

    <!-- 音乐列表 -->
    <div class="songList">
      <div class="songLT">歌曲列表</div>
      <div class="newMusicList clearfix" v-for="(item,index) in songs" :key="index">
        <div class="fl musicNum">{{index+1}}</div>
        <div class="fl clearfix musicBox">

          <div class="fl musicDsc">
            <div class="musicName">{{item.name}}</div>
            <div class="musicPeople">
              <i class="bgImg"></i>
              {{item.ar[0].name}}
            </div>
          </div>
          <div class="fr play" @click="changePlayShow">
            <span class="bgImg" @click="getSongItemUrl(item,index)"></span>
          </div>
        </div>
      </div>
    </div>

    

    
  </div>
</template>

<script>
// import {createNamespacedHelpers} from 'vuex'
import lyric from '../assets/js/lyric'

// const {mapState,mapMutations} = createNamespacedHelpers('songModule')

  export default {
    data(){
      return{
        mid:'',
        ids:'',
        songImg:'',
        songs:[],
        titleName:'',
        nickname:'',
        creatorImg:'',
        show: false,
        isPlay:false,
        playIng:{
          url:'index-play.png'
        },
        pauseIng:{
          url:'index-pause.png'
        },
        audio:'',
        playerInfo:{
          songName:'',
          singer:'',
          picUrl:''
        },
        xuanzhuanImg:''
      }
    },
    computed:{
      // ...mapState(['songIds'])
    },
    created(){
      this.ids = this.$route.query.ids
      this.songImg = this.$route.query.songImg
      this.titleName = this.$route.query.title
      this.nickname = this.$route.query.nickname
      this.creatorImg = this.$route.query.creatorImg
      // 
      this.getSongDetail();
      // this.getSongUrl()
      this.$nextTick(() => {
        this.audio = this.$refs['audio'];
        this.xuanzhuanImg = this.$refs['xuanzhuanImg']
      })
    },
    methods:{
      
      goBack(){
        this.$router.go(-1)
      },

      //显示底部播放器图标
      changePlayShow(){
        this.$store.commit('getPlayIsShow',true)
      },
      
      //获取歌单列表的音乐
      getSongDetail(){
        this.axios({
          method:'GET',
          url:'/song/detail',
          params:{
            ids:this.ids
          }
        }).then(result => {
          // 
          if(result.data.code == 200){
            this.songs = result.data.songs;
          }
        }).catch(err => {
          
        })
      },

      //获取点击音乐的url
      getSongItemUrl(item,i){
        this.axios({
          method:'GET',
          url:'/song/url',
          params:{
            id:item.id
          }
        }).then(result => {
          if(result.data.code == 200){
            
            this.$store.state.songUrl = result.data.data[0].url;
            if(!this.$store.state.isPlay){
              this.$store.state.isPlay = !this.$store.state.isPlay;
            }
            
            this.$store.state.playerInfo={}
            let o = {};
            // 
            o.songName = this.songs[i].name;
            o.singer = this.songs[i].ar[0].name;
            o.picUrl = this.songs[i].al.picUrl;
            this.$store.state.playerInfo = o
            this.$store.commit('getCcurrentPlayList',this.songs)

          }
        }).catch(err => {
          
        })

        //获取歌词---------------------------------------
      
        this.axios({
          method:'GET',
          url:'/lyric',
          params:{
            id:item.id
          }
        }).then(result => {
          if(result.data.code == 200){
            this.lrc = []
            this.songlrc = result.data.lrc.lyric
            lyric.createLrcObj(this.songlrc)
            this.lrc = lyric.songInfo.oLRC.ms
            this.$store.commit('songLrc',this.lrc)

          }

        }).catch(err => {
          
        })
      },

      changePlayIcon(){
        this.isPlay = !this.isPlay
        if(this.isPlay){
          this.audio.play();
        }else{
          this.audio.pause();
        }
      }
      //获取音乐url
      // getSongUrl(id){
      //   this.axios({
      //     method:'GET',
      //     url:'/song/url',
      //     params:{
      //       id
      //     }
      //   }).then(result => {
      //     
      //   }).catch(err => {
      //     
      //   })
      // },

      
    }
  }
</script>

<style lang="less" scoped>
.songListDetails{
  // background-color: #e8e8e8;
  /deep/ .van-nav-bar{
    border-bottom: 1px solid #e8e8e8;
    z-index: 111;
  }
  /deep/ .van-nav-bar__title{
    color: skyblue;
  }
  /deep/ [class*=van-hairline]::after{
    border: 0px;
  }
  /deep/ .van-nav-bar__text{
    color: blue;
  }
  /deep/ .van-icon{
    color: blue;
  }
  .topBg{
    height: 279px;
    width: 100%;
    background-position: 50% center;
    background-size: cover;
    background-repeat: no-repeat;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    filter: blur(20px);
    &::after{
      content: "";
      background-color: rgba(0,0,0,.25);
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
    }
  }
  .topBgBox{
    display: flex;
    position: relative;
    z-index: 2;
  }
  .topImg{
    width: 126px;
    height: 126px;
    margin: 20px 10px;
    // background-color: skyblue;
    display: flex;
  }
  .topDesc{
    margin-top: 20px;
    width: calc(~"100% - 146px");
    height: 100%;

  }
  .topTitle{
    font-size: 17px;
    color: #fff;
    text-indent: 0.5em;
    padding-right: 10px;
  }
  .topUser{
    margin-top: 20px;
    font-size: 14px;
    line-height: 30px;
    color: hsla(0,0%,100%,.7);
  }
  .songList{
    padding-bottom: 70px;
    position: relative;
    background: #fff;
    z-index: 3;
  }
  .songLT{
    background-color: #eeeff0;
    font-size: 12px;
    padding: 2px 10px;
    border-bottom: 1px solid #eee;
  }
  .newMusicList{
  }
  .musicNum{
    width: 40px;
    height: 55px;
    line-height: 55px;
    font-size: 17px;
    color: #a3acbd;
    text-align: center;
  }
  .musicBox{
    width: calc(~"100% - 40px");
    border-bottom: 1px solid #eee;

  }
  .creatorImg{
    width: 30px;
    height: 30px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 10px;
  }
  .musicDsc{
    width: calc(~"100% - 42px");
    padding: 6px 0;
    .musicName{
      height: 25px;
      font-size: 15px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: normal;
      display: block;
    }
    .musicPeople{
      height: 18px;
      font-size: 12px;
      color: #888;
      >i{
        display: inline-block;
        width: 12px;
        height: 8px;
        margin-right: 4px;
      }
    }
  }
  .play{
    width: 22px;
    height: 55px;
    padding: 0 10px;
    align-items: center;
    display: flex;
    >span{
      display: inline-block;
      width: 22px;
      height: 22px;
      background-position: -24px 0;
    }
  }
  .bgImg{
    background: url("../assets/images/index_icon_2x.png") no-repeat;
    background-size: 166px 97px;
  }
  
}
</style>