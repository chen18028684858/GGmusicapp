<template>
  <div id="app">

    <audio ref="audios" :src="songUrl" class="audio_box"></audio>

    <div ref="player" class="bottomPlay clearfix" @click="changeShow" v-show="playIsShow">
      <div class="fl clearfix playLeft">
        <div class="fl songImg">
          <img class="auto_img" :class="isPlays ? 'xuanzhuan' : 'xuanzhuan suspended'" :src="playerInfo=='' ? '' : playerInfo.picUrl">
        </div>
        <div class="fl songDesc">
          <div class="songName" >{{playerInfo=='' ? '' : playerInfo.songName}}</div>
          <div class="singerName">{{playerInfo=='' ? '' : playerInfo.singer}}</div>
        </div>
      </div>
      <div class="fr playRight clearfix" >
        <div class="playIcon fl" >
          <img @click.stop="changePlayIcon" @click="playOrPause" ref="playIcon" class="auto_img" :src="require('./assets/images/player/' + (isPlays ? pauseIng.url : playIng.url) )" alt="">
          <div  @click.stop="changePlayIcon" @click="playOrPause">
            <van-circle v-model="circle" :rate="lengthCircle" :stroke-width="45" :speed="100" size="26px" />
          </div>
        </div>
        <div class="fl songListBox" @click.stop="changeShowListT">
          <img class="songListIcon auto_img" src="./assets/images/songlist.png" alt="">
        </div>
      </div>
      
    </div>

    <van-popup
      v-model="show"
      closeable
      close-icon="arrow-down"
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100%' }"
      @opened="getLrc"
      get-container="body"
      :lazy-render="false"
    >
      <div class="playerBox">
        <div class="playerBg" :style="{'backgroundImage':'url(' + playerInfo.picUrl + ')'}"></div>
        <div class="playItem">

          <div class="discBox">
            <!-- 歌碟 -->
            <div class="discItem">
              <div class="discItemBox ">
                <div class="discItemBg ">
                  <div class="discItemImg" :class="isPlays ? 'xuanzhuan' : 'xuanzhuan suspended'">
                    <img class="auto_img" :src="playerInfo.picUrl" >

                  </div>
                </div>
                <div class="discItemLight" :class="isPlays ? 'xuanzhuan' : 'xuanzhuan suspended'"></div>
              </div>
            </div>

            <!-- 歌曲信息 -->
            <div>
              <div class="songInfo">
                <!-- 歌曲名字和歌手 -->
                <div class="songInfoTitle">
                  <span class="songInfoName">{{playerInfo.songName}}</span>
                  <span class="songInfoLine">-</span>
                  <span class="songInfoAr">{{playerInfo.singer}}</span>
                </div>
                <!-- 歌词 -->
                <div class="songInfoLyric">
                  <div class="lyricBox">
                    <div class="lyricList" ref="lrc">
                      <p ref="p" class="" v-for="(item,index) in lrcs" :key="index">{{item.c}}</p>
                      
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <!-- 进度条 -->
            <div class="progress clearfix">
              <div class="fl progressTime"><span>{{curTimeM}}</span>:<span>{{curTimeS}}</span></div>
              <div class="fl progressBar">
                <div class="progressOut">
                  <span class="progressIn" :style="{'width':widthL+'%'}"></span>
                </div>
              </div>
              <div class="fr" style="color: #fff;"><span>{{allTimeM}}</span>:<span>{{allTimeS}}</span></div>
            </div>

          </div>

        </div>
        <div></div>

      </div>

      <div class="controls">

        <div class="a1 clearfix controls_box">
          
          <div class="fl controls_type">
            <img class="play_type auto_img" @click="changePlayType" :src="require('./assets/images/player/'+playType.titles[playType.default])" />
          </div>
          <div class="fl controls_icons">
            <span class="prev" @click="lastSong"></span>
            <span @click.stop="changePlayIcon" @click="playOrPause" id="play_pause" :class="isPlays ? 'play_pause' : 'play_play'" data-play="0"></span>
            <span class="next" @click="nextSong"></span>
          </div>
          <div class="fr controls_like" @click.stop="changeShowListT">
            <img class="auto_img" src="./assets/images/songlistIn.png" />
          </div>
          
        </div>

      </div> 
    </van-popup>


    <!-- 播放列表 -->
    <van-popup
      v-model="showList"
      class="playListShow"
      
      
      position="bottom"
      :style="{ height: '50%' }"
      
    >

      <div class="playList" >
        <div class="currentList">
          <div class="newMusicList clearfix" v-for="(item,index) in currentPlayList" :key="index">
            <div @click="getSongItemUrl(item,index)">
              <div class="fl musicDsc">
                <div class="musicName">{{item.name}}</div>
                <div class="musicPeople" v-if="item.song">
                  <i class="bgImg"></i>
                  {{item.song.artists[0].name}}
                </div>
                <div class="musicPeople" v-else-if="item.ar">
                  <i class="bgImg"></i>
                  {{item.ar[0].name}}
                </div>
                <div class="musicPeople" v-else>
                  <i class="bgImg"></i>
                  {{item.artists[0].name}}
                </div>
              </div>
              <div class="fr play" >
                <span class="bgImg" ></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
    


    <div>
      <router-view/>
    </div>
  </div>
</template>

<script>
import "./assets/less/player.less";
import "./assets/less/main.less";
import lyric from './assets/js/lyric'
  export default{

    data(){
      return {
        listShow:false,
        playIng:{
          url:'index-play.png'
        },//播放图标
        pauseIng:{
          url:'index-pause.png'
        },//暂停图标
        audio:'',
        show:false,//是否弹出歌词页
        showList:false,
        xuanzhuanImg:'',//旋转的图片
        playType:{
          titles:['danqu_32.png','liebiao.png','random.png'],
          default:1
        },//播放类型的切换
        lrc:'',
        plis:[],
        curTimeS:0,//当前播放时间的秒数
        curTimeM:0,//当前播放时间的分数
        allTimeS:0,//总的播放时间的秒数
        allTimeM:0,//总的播放时间的分数
        widthL:0, //进度条的长度
        lengthCircle:0,
        circle:0,
        timer:null,
        lrc:[],//歌词
        songlrc:'',
        num:0
      }
    },
    created(){
      this.$nextTick(() => {
        this.audio = this.$refs.audios;
        this.audio.autoplay = true;
        
        this.xuanzhuanImg = this.$refs.xuanzhuanImg
        this.lrc = this.$refs.lrc;
      })
      // this.beginPlay()
      // this.playerInfo()
      
    },
    
    computed: {
      playIsShow(){
        return this.$store.state.playIsShow
      },
      isPlays(){
        return this.$store.state.isPlay

      },
      
      playerInfo(){
        return this.$store.state.playerInfo

      },
      
      songUrl(){
        return this.$store.state.songUrl
      },

      allPlayUrl(){
        return this.$store.state.allPlayUrl

      },

      lrcs(){
        return this.$store.state.songLrcs
      },
      currentPlayList(){
        return this.$store.state.currentPlayList
      },
      getNowIndex(){
        return this.$store.state.nowIndex
      }
    },
    

    methods:{
      //切换播放图标
      changePlayIcon(){
        this.$store.state.isPlay = !this.$store.state.isPlay;
        if(this.isPlay){
          this.audio.play();
        }else{
          this.audio.pause();
        }
      },

      //切换播放模式
      changePlayType(){
        let playType = this.playType;
        playType.default = playType.default == playType.titles.length - 1 ? 0 : playType.default + 1;
        
      },

      //弹出歌词页
      changeShow(){
        this.show = true
        
      },

      //歌词滚动
      getLrc(){
        this.$nextTick(() => {
        
          this.lrc = this.$refs.lrc;
          this.audio = this.$refs.audios;
          let lrc = ''
          let lis = [];
          let songLyrics = []
          let lineNum = 0;
          let C_pos= 0 //C位
          let offset= -30 //滚动距离（应等于行高）
          var that = this
          songLyrics = this.$store.state.songLrcs
          
          lrc = this.lrc;
          lis = lrc.children; //歌词数组
        
          //高亮显示歌词当前行及文字滚动控制，行号为lineNo
          function lineHigh(lrc) {
            // var lis = lrc.getElementsByTagName("p"); //歌词数组
            if (lineNum > 0) {
              lis[lineNum - 1].removeAttribute("class"); //去掉上一行的高亮样式
            }
            lis[lineNum].className = "active"; //高亮显示当前行

            //文字滚动
            if (lineNum > C_pos) {
              lrc.style.transform = "translateY(" + (lineNum - C_pos) * offset + "px)"; //整体向上滚动一行高度
            }
          }
          
          
          //滚回到开头，用于播放结束时
          function goback(lrc,lis) {
            lis[lis.length-1].removeAttribute("class");
            lrc.style.transform = "translateY(0)";
            lineNum = 0;
          }

          //监听播放器的timeupdate事件，实现文字与音频播放同步
          this.audio.ontimeupdate = function () {
            if (lineNum == songLyrics.length){
              return;
            }
            var curTime = this.currentTime; //播放器时间
            var s = Math.floor(curTime%60);
            var m = Math.floor(curTime/60);
            s = s < 10 ? '0'+s:s
            m = m < 10 ? '0'+m:m
            that.curTimeS = s;
            that.curTimeM = m;
            var allTime = this.duration
            var S = Math.floor(allTime%60);
            var M = Math.floor(allTime/60);
            S = S < 10 ? '0'+S:S
            M = M < 10 ? '0'+M:M
            that.allTimeS = S;
            that.allTimeM = M;
            that.widthL = Math.floor( curTime/allTime * 100 )
            if (parseFloat(songLyrics[lineNum].t) <= curTime) {
              lineHigh(lrc,lis); //高亮当前行
              lineNum++;
            }
            
          };

          //监听播放器的ended事件，播放结束时回滚歌词
          this.audio.onended = function () {
            goback(lrc,lis); //回滚歌词
            that.$store.commit('taggleIsPlay',false)
            let length = that.currentPlayList.length 
            that.num = that.getNowIndex + 1 
            
            if(that.playType.default == 1 || that.playType.default == 0){
              if(that.num > length - 1){
                that.num = 0
              }
            }else if(that.playType.default == 2){
              that.num = Math.floor(Math.random()*length)
            }
            
            that.getSongDetail(that.currentPlayList[that.num].id)
            that.getSongItemUrl(that.currentPlayList[that.num],that.num)
            that.getLrc()
            that.$store.commit('changeNowIndex',that.num)
            that.changeProgressBar()
          };
        })
      },

      //音乐播放列表弹出
      changeShowListT(){
        this.showList = true
      },

      //音乐播放列表隐藏
      changeShowListF(){
        this.showList = false
      },

      //暂停或开始播放
      playOrPause(){
        
        if(!this.$store.state.isPlay){
          this.$store.commit('playOrPause',false)
          this.audio.pause();
        }else{
          this.$store.commit('playOrPause',true)
          this.audio.play();

        }
        

      },

      //播放器圆形进度条
      changeProgressBar(){
        if(this.$store.state.isPlay){
          this.timer = setInterval(() => {
            
            var curTimes = this.audio.currentTime;
            var allTimes = this.audio.duration 
            this.lengthCircle = Math.floor( curTimes/allTimes * 100 )
            if( curTimes == allTimes ){
              clearInterval(this.timer)
              this.lengthCircle = 0
              this.$store.commit('taggleIsPlay',false)
            }
          },1000)

        }else{
          clearInterval(this.timer)
          this.timer = null
        }
      },

      //
      //获取点击音乐的url
      getSongItemUrl(item,i){
        // 
        
        this.axios({
          method:'GET',
          url:'/song/url',
          params:{
            id:item.id
          }
        }).then(result => {
          // 
          if(result.data.code == 200){
            
            this.$store.state.songUrl = result.data.data[0].url;
            if(!this.$store.state.isPlay){
              this.$store.state.isPlay = !this.$store.state.isPlay;
            }
            // this.$store.state.isPlay=true
            

          }
        }).catch(err => {
          
        })
        this.getSongDetail(item.id)
        
        //------------------------------------------

        //获取歌词
    
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

      //获取歌曲详情
      getSongDetail(ids){
        this.axios({
          method:'GET',
          url:'/song/detail',
          params:{
            ids
          }
        }).then(result => {
          if(result.data.code == 200){
            this.$store.state.playerInfo={}
            let o = {};
            o.songName = result.data.songs[0].name;
            o.singer = result.data.songs[0].ar[0].name;
            o.picUrl = result.data.songs[0].al.picUrl;
            this.$store.state.playerInfo = o
          // 
          }
        }).catch(err => {
          
        })
      },

      //下一首歌
      nextSong(){
        let length = this.currentPlayList.length 
        this.num = this.getNowIndex + 1 
        
        if(this.playType.default == 1 || this.playType.default == 0){
          if(this.num > length - 1){
            this.num = 0
          }
        }else if(this.playType.default == 2){
          this.num = Math.floor(Math.random()*length)
        }
        
        this.getSongDetail(this.currentPlayList[this.num].id)
        this.getSongItemUrl(this.currentPlayList[this.num],this.num)
        this.getLrc()
        this.$store.commit('changeNowIndex',this.num)
        this.changeProgressBar()
        
      },

      //上一首歌
      lastSong(){
        let length = this.currentPlayList.length
        let num = this.getNowIndex - 1 
        if(this.playType.default == 1 || this.playType.default == 0){
          if(num < 0){
            num = length - 1
          }
        }else if(this.playType.default == 2){
          let num = Math.random()*length
        }
        this.getSongDetail(this.currentPlayList[num].id)
        this.getSongItemUrl(this.currentPlayList[num],num)
        this.getLrc()
        this.$store.commit('changeNowIndex',num)
        this.changeProgressBar()
      }
      

    },
    watch:{
      isPlays:'changeProgressBar'
    }
  }
</script>

<style lang="less">

.fl{
  float: left;
}
.fr{
  float: right;
}
.clearfix::after{
  content: "";
  display: block;
  clear: both;
}
.auto_img{
  display: block;
  width: 100%;
}


</style>
