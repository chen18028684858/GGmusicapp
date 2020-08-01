<template>
  <div class="search">
    <van-search
      v-model="keywords"
      show-action
      left-icon="arrow-left"
      @click-left-icon="goBack"
      placeholder="请输入搜索关键词"
    >
      <template #action >
        <div @click="searchSong(keywords)">搜索</div>
      </template>
    </van-search>
    <div class="searchPage">
      <div class="searchBox">
        <div class="searchList clearfix" @click="changePlayShow" v-for="(item,index) in searchList" :key="index">
          <div @click="getSongItemUrl(item,index)">
            <div class="fl searchMusicDsc">
              <div class="searchMusicName">{{item.name}}</div>
              <div class="searchMusicPeople">
                <i class="bgImg"></i>
                {{item.artists[0].name}}
              </div>
            </div>
            <div class="fr play">
              <span class="bgImg" ></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import lyric from '../assets/js/lyric'

  export default {
    data(){
      return {
        keywords:'',
        lrc:[],//歌词
        songlrc:'',
        allSongList:[],
        newMusic:[],//最新音乐
      }
    },
    computed:{
      searchList(){
        return this.$store.state.searchList
      },
      searchHistoryNav(){
        return this.$store.state.searchHistoryNav
      }
      
    },
    
    methods:{

      //搜索歌曲
      searchSong(keywords){
        if(!keywords){
          this.$toast('请输入搜索内容')
          return
        }
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
          duration: 0
        });

        this.axios({
          method:'GET',
          url:'/search',
          params:{
            keywords
          }
        }).then(result => {
          this.$toast.clear()
          
          if(result.data.code == 200){
            this.$store.commit('getSearchList',result.data.result.songs)
            this.historyNavs.push(this.keywords)
          }
        }).catch(err => {
          this.$toast.clear()
          
        })
      },

      //返回
      goBack(){
        this.$router.go(-1)
      },

      //显示底部播放器图标
      changePlayShow(){
        this.$store.commit('getPlayIsShow',true)
      },

      //获取点击音乐的url
      getSongItemUrl(item,i){
        // 
        if(i != undefined && item != undefined){
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
              // this.$store.state.isPlay=true
              this.$store.commit('getCcurrentPlayList',this.searchList)
              this.$store.commit('changeNowIndex',i)
              
              

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
              // 
              this.lrc = []
              this.songlrc = result.data.lrc.lyric
              lyric.createLrcObj(this.songlrc)
              this.lrc = lyric.songInfo.oLRC.ms
              this.$store.commit('songLrc',this.lrc)

            }

          }).catch(err => {
            
          })
      

        }else if(item != undefined && i == undefined){

          this.axios({
            method:'GET',
            url:'/song/url',
            params:{
              id:item
            }
          }).then(result => {
            if(result.data.code == 200){
              
              let arr = []
              result.data.data.forEach(v => {
                let o = {}
                o.url = v.url
                o.id = v.id
                arr.push(o)
              })
                this.allSongList = arr
              // this.allSongList = result.data.data
              this.$store.commit('getAllSongUrl',this.allSongList)
              
              
            }
          }).catch(err => {
            
          })
        }

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
          // 
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



    }
  }
</script>

<style lang="less" scoped>
.search{
  .van-search__content{
    background-color: white;
  }
  /deep/ .van-field__control{
    padding-left: 10px;
    border-bottom: 1px solid black;
    margin-left: 10px;
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
  .searchBox{
    padding: 0 10px;
    padding-left: 20px;
    margin-top: 20px;
  }
  .searchMusicName{
    height: 30px;
    line-height: 30px;
    font-size: 14px;
  }
  .searchMusicPeople{
    height: 25px;
    color: #b7b7b7;
    >i{
      display: inline-block;
      width: 12px;
      height: 8px;
      margin-right: 2px;
    }
  }
}
</style>